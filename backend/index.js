import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

dotenv.config();

const app = express();

// Configure CORS
// app.use(cors({
//     origin: process.env.NODE_ENV === 'production' 
//         ? process.env.FRONTEND_URL 
//         : 'http://localhost:5173', // Default Vite dev server port
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

app.use(express.json());
app.use(cookieParser());

// Configure session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait for a connection
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

// Create tables if they don't exist
const initDb = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS blood_bank_auth (
                license_number VARCHAR(12) PRIMARY KEY,
                password_hash TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS hospital_auth (
                hospital_id VARCHAR(30) PRIMARY KEY,
                password_hash TEXT NOT NULL,
                name VARCHAR(100) NOT NULL,
                city VARCHAR(50) NOT NULL,
                type VARCHAR(20) NOT NULL
            );
        `);
        
        await client.query('COMMIT');
        console.log('Database initialized successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Database initialization error:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Initialize database with error handling
(async () => {
    try {
        await initDb();
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
})();

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

// Blood Bank Login     WORKING!!!!!!!!!!!!!!!!!!!
app.post('/api/bloodbank/login', async (req, res) => {
    try {
        const { licenseNumber, password } = req.body;

        // Validate input
        if (!licenseNumber || !password) {
            return res.status(400).json({ error: 'License number and password are required' });
        }

        const bloodBankResult = await pool.query(
            'SELECT * FROM blood_bank_auth WHERE license_number = $1',
            [licenseNumber]
        );

        if (bloodBankResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const bloodBank = bloodBankResult.rows[0];

        const isValidPassword = await bcrypt.compare(password, bloodBank.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = bloodBank.license_number;
        req.session.userType = 'bloodbank';

        res.json({
            message: 'Login successful',
            user: {
                id: bloodBank.license_number,
                name: bloodBank.name,
                city: bloodBank.city,
                type: 'bloodbank'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Hospital Login
app.post('/api/hospital/login', async (req, res) => {
    try {
        const { hospitalId, password } = req.body;

        // Validate input
        if (!hospitalId || !password) {
            return res.status(400).json({ error: 'Hospital ID and password are required' });
        }

        // Check if hospital exists
        const hospitalResult = await pool.query(
            'SELECT * FROM hospital_auth WHERE hospital_id = $1',
            [hospitalId]
        );

        if (hospitalResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const hospital = hospitalResult.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, hospital.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set session data
        req.session.userId = hospital.hospital_id;
        req.session.userType = 'hospital';

        res.json({
            message: 'Login successful',
            user: {
                id: hospital.hospital_id,
                name: hospital.name,
                city: hospital.city,
                type: 'hospital'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Get current user
app.get('/api/me', isAuthenticated, async (req, res) => {
    try {
        let userQuery;
        if (req.session.userType === 'bloodbank') {
            userQuery = await pool.query(
                'SELECT license_number as id, name, city FROM blood_bank_auth WHERE license_number = $1',
                [req.session.userId]
            );
        } else {
            userQuery = await pool.query(
                'SELECT hospital_id as id, name, city FROM hospital_auth WHERE hospital_id = $1',
                [req.session.userId]
            );
        }

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userQuery.rows[0];
        res.json({
            ...user,
            type: req.session.userType
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register Blood Bank
app.post('/api/bloodbank/register', async (req, res) => {
    try {
        const {
            name,
            licenseNumber,
            city,
            password
        } = req.body;

        // Validate required fields
        if (!name || !licenseNumber || !city || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Generate unique bloodBankId (BB + random 6 digits)
        const bloodBankId = 'BB' + Math.floor(100000 + Math.random() * 900000).toString();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store credentials in PostgreSQL
        await pool.query(
            'INSERT INTO blood_bank_auth (blood_bank_id, password_hash, name, license_number, city) VALUES ($1, $2, $3, $4, $5)',
            [bloodBankId, hashedPassword, name, licenseNumber, city]
        );

        let blockchainRegistration = null;
        // if (contract) {
        //     try {
        //         const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        //         const contractWithSigner = contract.connect(signer);

        //         const tx = await contractWithSigner.registerBloodBank(
        //             bloodBankId,
        //             name,
        //             licenseNumber,
        //             city
        //         );
        //         await tx.wait();
        //         blockchainRegistration = { transaction: tx.hash };
        //     } catch (error) {
        //         console.error('Blockchain registration failed:', error);
        //         // Continue anyway since we have the database record
        //     }
        // }

        res.json({ 
            success: true, 
            bloodBankId,
            ...(blockchainRegistration && { blockchain: blockchainRegistration })
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login Blood Bank
app.post('/api/bloodbank/login', async (req, res) => {
    try {
        const { bloodBankId, password } = req.body;

        // Get stored password hash
        const result = await pool.query(
            'SELECT password_hash FROM blood_bank_auth WHERE blood_bank_id = $1',
            [bloodBankId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, result.rows[0].password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set session
        req.session.userId = bloodBankId;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout Blood Bank
app.post('/api/bloodbank/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out');
        }
        res.send('Logged out');
    });
});

// Add Blood Unit
app.post('/api/bloodbank/add', isAuthenticated, async (req, res) => {
    try {
        const { bloodUnitId, donorId, bloodGroup, rhFactor, bloodBankId } = req.body;
        // const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        // const contractWithSigner = contract.connect(signer);

        // const tx = await contractWithSigner.addBloodUnit(
        //     bloodUnitId,
        //     donorId,
        //     bloodGroup,
        //     rhFactor,
        //     bloodBankId
        // );
        // await tx.wait();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Test Results
app.post('/api/bloodbank/test-results', isAuthenticated, async (req, res) => {
    try {
        const { 
            bloodUnitId,
            hiv,
            hepatitisB,
            hepatitisC,
            syphilis,
            malaria,
            pathogens,
            aboGrouping,
            rhFactor
        } = req.body;

        // Create test results object
        const testResults = {
            hiv,
            hepatitisB,
            hepatitisC,
            syphilis,
            malaria,
            pathogens,
            aboGrouping,
            rhFactor
        };

        // Initialize IPFS handler
        // const ipfsHandler = new IPFSHandler();

        // Upload test results to IPFS - this will also validate the data
        // const cid = await ipfsHandler.uploadTestResults(testResults);
        // await ipfsHandler.pinContent(cid);

        // Get the validated results to check isSafe
        // const validatedResults = await ipfsHandler.getTestResults(cid);

        // Update blockchain with test results
        // const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        // const contractWithSigner = contract.connect(signer);

        // const tx = await contractWithSigner.updateTestResults(
        //     bloodUnitId, 
        //     cid, 
        //     validatedResults.isSafe
        // );
        // await tx.wait();

        res.json({ 
            success: true 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Blood Unit Details
app.get('/api/bloodbank/:bloodUnitId', isAuthenticated, async (req, res) => {
    try {
        // const bloodUnit = await contract.bloodUnits(req.params.bloodUnitId);
        
        // If test results exist, fetch from IPFS
        // let testResults = null;
        // if (bloodUnit.testResultsCID) {
        //     testResults = await IPFSHandler.getTestResults(bloodUnit.testResultsCID);
        // }

        res.json({
            // bloodUnit,
            // testResults
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reserve Blood Unit
app.post('/api/hospital/reserve/:bloodUnitId', isAuthenticated, async (req, res) => {
    try {
        // const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        // const contractWithSigner = contract.connect(signer);

        // const tx = await contractWithSigner.reserveBloodUnit(req.params.bloodUnitId);
        // await tx.wait();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get blood units by status
app.get('/api/blood/status/:status', isAuthenticated, async (req, res) => {
    try {
        // const statusMap = {
        //     'not_verified': 0,
        //     'tested_safe': 1,
        //     'discarded': 2,
        //     'reserved': 3,
        //     'expired': 4,
        //     'transfused': 5
        // };

        // const status = req.params.status.toLowerCase();
        // if (!statusMap.hasOwnProperty(status)) {
        //     return res.status(400).json({ 
        //         error: 'Invalid status. Must be one of: not_verified, tested_safe, discarded, reserved, expired, transfused' 
        //     });
        // }

        // // Get blood unit IDs with matching status
        // const bloodUnitIds = await contract.getBloodUnitsByStatus(statusMap[status]);

        // // Get full details for each blood unit
        // const bloodUnits = await Promise.all(bloodUnitIds.map(async (id) => {
        //     const unit = await contract.bloodUnits(id);
        //     let testResults = null;

        //     // If unit has test results, fetch from IPFS
        //     if (unit.testResultsCID && unit.testResultsCID !== '') {
        //         const ipfsHandler = new IPFSHandler();
        //         testResults = await ipfsHandler.getTestResults(unit.testResultsCID);
        //     }

        //     // Convert BigNumber values to regular numbers
        //     return {
        //         bloodUnitId: unit.bloodUnitId,
        //         donorId: unit.donorId,
        //         bloodGroup: unit.bloodGroup,
        //         rhFactor: unit.rhFactor,
        //         collectedTimestamp: Number(unit.collectedTimestamp),
        //         bloodBankId: unit.bloodBankId,
        //         status: ['NOT_VERIFIED', 'TESTED_SAFE', 'DISCARDED', 'RESERVED', 'EXPIRED', 'TRANSFUSED'][Number(unit.status)],
        //         testResultsCID: unit.testResultsCID,
        //         testResults: testResults
        //     };
        // }));

        // res.json({
        //     status: status,
        //     count: bloodUnits.length,
        //     bloodUnits: bloodUnits
        // });
    } catch (error) {
        console.error('Error fetching blood units:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mark blood unit as transfused
app.post('/api/hospital/transfuse/:bloodUnitId', isAuthenticated, async (req, res) => {
    try {
        // const bloodUnitId = req.params.bloodUnitId;

        // // Get current blood unit status
        // const bloodUnit = await contract.bloodUnits(bloodUnitId);
        
        // if (!bloodUnit || !bloodUnit.bloodUnitId) {
        //     return res.status(404).json({ error: 'Blood unit not found' });
        // }

        // const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        // const contractWithSigner = contract.connect(signer);

        // const tx = await contractWithSigner.markBloodAsTransfused(bloodUnitId);
        // await tx.wait();

        res.json({ 
            success: true 
        });
    } catch (error) {
        console.error('Error marking blood as transfused:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search for compatible blood units for a patient
app.post('/api/hospital/request', isAuthenticated, async (req, res) => {
    try {
        // const { 
        //     patientName, 
        //     bloodType, 
        //     rhType, 
        //     hospitalId,
        //     timeRequested 
        // } = req.body;

        // // Validate required fields
        // if (!patientName || !bloodType || !rhType || !hospitalId) {
        //     return res.status(400).json({ 
        //         error: 'Missing required fields. Please provide patientName, bloodType, rhType, and hospitalId' 
        //     });
        // }

        // // Validate blood type
        // const validBloodTypes = ['A', 'B', 'AB', 'O'];
        // const validRhTypes = ['positive', 'negative'];
        // if (!validBloodTypes.includes(bloodType.toUpperCase())) {
        //     return res.status(400).json({ 
        //         error: 'Invalid blood type. Must be one of: A, B, AB, O' 
        //     });
        // }

        // if (!validRhTypes.includes(rhType.toLowerCase())) {
        //     return res.status(400).json({ 
        //         error: 'Invalid Rh type. Must be either positive or negative' 
        //     });
        // }

        // // Get compatible blood units from blockchain
        // const compatibleUnits = await contract.getCompatibleBloodUnits(
        //     bloodType.toUpperCase(), 
        //     rhType.toLowerCase()
        // );

        // // Get full details for each compatible unit
        // const bloodUnits = await Promise.all(compatibleUnits.map(async (id) => {
        //     const unit = await contract.bloodUnits(id);
        //     let testResults = null;

        //     // If unit has test results, fetch from IPFS
        //     if (unit.testResultsCID && unit.testResultsCID !== '') {
        //         const ipfsHandler = new IPFSHandler();
        //         testResults = await ipfsHandler.getTestResults(unit.testResultsCID);
        //     }

        //     return {
        //         bloodUnitId: unit.bloodUnitId,
        //         bloodGroup: unit.bloodGroup,
        //         rhFactor: unit.rhFactor,
        //         collectedTimestamp: Number(unit.collectedTimestamp),
        //         bloodBankId: unit.bloodBankId,
        //         testResultsCID: unit.testResultsCID,
        //         testResults: testResults
        //     };
        // }));

        // // Sort units by collection date (newest first)
        // bloodUnits.sort((a, b) => b.collectedTimestamp - a.collectedTimestamp);

        // // Store request details in IPFS for record-keeping
        // const requestDetails = {
        //     patientName,
        //     bloodType: bloodType.toUpperCase(),
        //     rhType: rhType.toLowerCase(),
        //     hospitalId,
        //     timeRequested: timeRequested || new Date().toISOString(),
        //     matchingUnitsCount: bloodUnits.length,
        //     matchingUnitIds: bloodUnits.map(unit => unit.bloodUnitId)
        // };

        // const ipfsHandler = new IPFSHandler();
        // const requestCid = await ipfsHandler.uploadTestResults(requestDetails);
        // await ipfsHandler.pinContent(requestCid);

        res.json({
            success: true
        });
    } catch (error) {
        console.error('Error processing blood request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Temporary blood bank registration endpoint
app.post('/api/temp/bloodbank/register', async (req, res) => {
    console.log(req.body);
    try {
        const { licenseNumber, password } = req.body;

        // Validate input
        if (!licenseNumber || !password) {
            return res.status(400).json({ 
                error: 'License number and password are required' 
            });
        }

        // Check if blood bank already exists
        const existingBloodBank = await pool.query(
            'SELECT license_number FROM blood_bank_auth WHERE license_number = $1',
            [licenseNumber]
        );

        if (existingBloodBank.rows.length > 0) {
            return res.status(409).json({ 
                error: 'Blood bank with this license number already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        await pool.query(
            'INSERT INTO blood_bank_auth (license_number, password_hash) VALUES ($1, $2)',
            [licenseNumber, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Blood bank registered successfully',
            licenseNumber
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Temporary hospital registration endpoint working!!
app.post('/api/temp/hospital/register', async (req, res) => {
    console.log(req.body);
    try {
        const { hospitalId, password, name, city, type } = req.body;

        // Validate input
        if (!hospitalId || !password || !name || !city || !type) {
            return res.status(400).json({ 
                error: 'All fields (hospitalId, password, name, city, type) are required' 
            });
        }

        // Check if hospital already exists
        const existingHospital = await pool.query(
            'SELECT hospital_id FROM hospital_auth WHERE hospital_id = $1',
            [hospitalId]
        );

        if (existingHospital.rows.length > 0) {
            return res.status(409).json({ 
                error: 'Hospital with this ID already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        await pool.query(
            'INSERT INTO hospital_auth (hospital_id, password_hash, name, city, type) VALUES ($1, $2, $3, $4, $5)',
            [hospitalId, hashedPassword, name, city, type]
        );

        res.status(201).json({ 
            message: 'Hospital registered successfully',
            hospitalId,
            name,
            city,
            type
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Example of caching a frequently requested data
app.get('/api/data', async (req, res) => {
    // Fetch data from the database or another source
    const data = await fetchDataFromSource();
    res.json(data);
});

const PORT = process.env.PORT || 3000;

// Start server with proper error handling
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing HTTP server...');
    server.close(() => {
        console.log('HTTP server closed.');
        pool.end(() => {
            console.log('Database pool closed.');
            process.exit(0);
        });
    });
});