import express from 'express';
import { ethers } from 'ethers';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import IPFSHandler from '../ipfs/ipfsHandler.js';
import contractABI from '../blockchain/contractABI.json' assert { type: "json" };
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL setup
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

// Create tables if they don't exist
const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS blood_bank_auth (
                blood_bank_id VARCHAR(10) PRIMARY KEY,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                license_number VARCHAR(50) NOT NULL,
                city VARCHAR(50) NOT NULL,
                contact_number VARCHAR(15),
                email VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS hospital_auth (
                hospital_id VARCHAR(10) PRIMARY KEY,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                city VARCHAR(50) NOT NULL,
                contact_number VARCHAR(15),
                email VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS donors (
                donor_id VARCHAR(20) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                blood_group VARCHAR(3) NOT NULL,
                rh_factor VARCHAR(10) NOT NULL,
                age INTEGER NOT NULL,
                gender VARCHAR(10) NOT NULL,
                contact_number VARCHAR(15),
                address TEXT,
                last_donation_date TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS recipients (
                recipient_id VARCHAR(20) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                blood_group VARCHAR(3) NOT NULL,
                rh_factor VARCHAR(10) NOT NULL,
                age INTEGER NOT NULL,
                gender VARCHAR(10) NOT NULL,
                hospital_id VARCHAR(10) REFERENCES hospital_auth(hospital_id),
                diagnosis TEXT,
                blood_unit_id VARCHAR(20) DEFAULT 'None',
                urgency_level VARCHAR(20),
                request_date TIMESTAMP WITH TIME ZONE,
                contact_number VARCHAR(15),
                medical_history TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

        `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

initDb();

// Initialize Ethereum provider and contract
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractABI,
    provider
);

// Routes

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

        // Register on blockchain
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(signer);

        const tx = await contractWithSigner.registerBloodBank(
            bloodBankId,
            name,
            licenseNumber,
            city
        );
        await tx.wait();

        res.json({ 
            success: true, 
            bloodBankId,
            transaction: tx.hash 
        });
    } catch (error) {
        console.error('Registration error:', error);
        // Clean up PostgreSQL entry if blockchain registration fails
        if (error.code !== '23505') { // Not a duplicate key error
            try {
                await pool.query(
                    'DELETE FROM blood_bank_auth WHERE blood_bank_id = $1',
                    [bloodBankId]
                );
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
        }
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

        // Get blood bank details from blockchain
        const bloodBank = await contract.bloodBanks(bloodBankId);

        res.json({
            success: true,
            bloodBank: {
                bloodBankId: bloodBank.bloodBankId,
                name: bloodBank.name,
                licenseNumber: bloodBank.licenseNumber,
                city: bloodBank.city,
                isVerified: bloodBank.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Blood Unit
app.post('/api/bloodbank/add', async (req, res) => {
    try {
        const { bloodUnitId, donorId, bloodGroup, rhFactor, bloodBankId } = req.body;
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(signer);

        const tx = await contractWithSigner.addBloodUnit(
            bloodUnitId,
            donorId,
            bloodGroup,
            rhFactor,
            bloodBankId
        );
        await tx.wait();

        res.json({ success: true, transaction: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Test Results
app.post('/api/bloodbank/test-results', async (req, res) => {
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
        const ipfsHandler = new IPFSHandler();

        // Upload test results to IPFS - this will also validate the data
        const cid = await ipfsHandler.uploadTestResults(testResults);
        await ipfsHandler.pinContent(cid);

        // Get the validated results to check isSafe
        const validatedResults = await ipfsHandler.getTestResults(cid);

        // Update blockchain with test results
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(signer);

        const tx = await contractWithSigner.updateTestResults(
            bloodUnitId, 
            cid, 
            validatedResults.isSafe
        );
        await tx.wait();

        res.json({ 
            success: true, 
            transaction: tx.hash,
            cid: cid,
            testResults: validatedResults
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Blood Unit Details
app.get('/api/bloodbank/:bloodUnitId', async (req, res) => {
    try {
        const bloodUnit = await contract.bloodUnits(req.params.bloodUnitId);
        
        // If test results exist, fetch from IPFS
        let testResults = null;
        if (bloodUnit.testResultsCID) {
            testResults = await IPFSHandler.getTestResults(bloodUnit.testResultsCID);
        }

        res.json({
            bloodUnit,
            testResults
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reserve Blood Unit
app.post('/api/hospital/reserve/:bloodUnitId', async (req, res) => {
    try {
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(signer);

        const tx = await contractWithSigner.reserveBloodUnit(req.params.bloodUnitId);
        await tx.wait();

        res.json({ success: true, transaction: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get blood units by status
app.get('/api/blood/status/:status', async (req, res) => {
    try {
        const statusMap = {
            'not_verified': 0,
            'tested_safe': 1,
            'discarded': 2,
            'reserved': 3,
            'expired': 4,
            'transfused': 5
        };

        const status = req.params.status.toLowerCase();
        if (!statusMap.hasOwnProperty(status)) {
            return res.status(400).json({ 
                error: 'Invalid status. Must be one of: not_verified, tested_safe, discarded, reserved, expired, transfused' 
            });
        }

        // Get blood unit IDs with matching status
        const bloodUnitIds = await contract.getBloodUnitsByStatus(statusMap[status]);

        // Get full details for each blood unit
        const bloodUnits = await Promise.all(bloodUnitIds.map(async (id) => {
            const unit = await contract.bloodUnits(id);
            let testResults = null;

            // If unit has test results, fetch from IPFS
            if (unit.testResultsCID && unit.testResultsCID !== '') {
                const ipfsHandler = new IPFSHandler();
                testResults = await ipfsHandler.getTestResults(unit.testResultsCID);
            }

            // Convert BigNumber values to regular numbers
            return {
                bloodUnitId: unit.bloodUnitId,
                donorId: unit.donorId,
                bloodGroup: unit.bloodGroup,
                rhFactor: unit.rhFactor,
                collectedTimestamp: Number(unit.collectedTimestamp),
                bloodBankId: unit.bloodBankId,
                status: ['NOT_VERIFIED', 'TESTED_SAFE', 'DISCARDED', 'RESERVED', 'EXPIRED', 'TRANSFUSED'][Number(unit.status)],
                testResultsCID: unit.testResultsCID,
                testResults: testResults
            };
        }));

        res.json({
            status: status,
            count: bloodUnits.length,
            bloodUnits: bloodUnits
        });
    } catch (error) {
        console.error('Error fetching blood units:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mark blood unit as transfused
app.post('/api/hospital/transfuse/:bloodUnitId', async (req, res) => {
    try {
        const bloodUnitId = req.params.bloodUnitId;

        // Get current blood unit status
        const bloodUnit = await contract.bloodUnits(bloodUnitId);
        
        if (!bloodUnit || !bloodUnit.bloodUnitId) {
            return res.status(404).json({ error: 'Blood unit not found' });
        }

        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(signer);

        const tx = await contractWithSigner.markBloodAsTransfused(bloodUnitId);
        await tx.wait();

        res.json({ 
            success: true, 
            transaction: tx.hash,
            message: `Blood unit ${bloodUnitId} has been marked as transfused`
        });
    } catch (error) {
        console.error('Error marking blood as transfused:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search for compatible blood units for a patient
app.post('/api/hospital/request', async (req, res) => {
    try {
        const { 
            patientName, 
            bloodType, 
            rhType, 
            hospitalId,
            timeRequested 
        } = req.body;

        // Validate required fields
        if (!patientName || !bloodType || !rhType || !hospitalId) {
            return res.status(400).json({ 
                error: 'Missing required fields. Please provide patientName, bloodType, rhType, and hospitalId' 
            });
        }

        // Validate blood type
        const validBloodTypes = ['A', 'B', 'AB', 'O'];
        const validRhTypes = ['positive', 'negative'];

        if (!validBloodTypes.includes(bloodType.toUpperCase())) {
            return res.status(400).json({ 
                error: 'Invalid blood type. Must be one of: A, B, AB, O' 
            });
        }

        if (!validRhTypes.includes(rhType.toLowerCase())) {
            return res.status(400).json({ 
                error: 'Invalid Rh type. Must be either positive or negative' 
            });
        }

        // Get compatible blood units from blockchain
        const compatibleUnits = await contract.getCompatibleBloodUnits(
            bloodType.toUpperCase(), 
            rhType.toLowerCase()
        );

        // Get full details for each compatible unit
        const bloodUnits = await Promise.all(compatibleUnits.map(async (id) => {
            const unit = await contract.bloodUnits(id);
            let testResults = null;

            // If unit has test results, fetch from IPFS
            if (unit.testResultsCID && unit.testResultsCID !== '') {
                const ipfsHandler = new IPFSHandler();
                testResults = await ipfsHandler.getTestResults(unit.testResultsCID);
            }

            return {
                bloodUnitId: unit.bloodUnitId,
                bloodGroup: unit.bloodGroup,
                rhFactor: unit.rhFactor,
                collectedTimestamp: Number(unit.collectedTimestamp),
                bloodBankId: unit.bloodBankId,
                testResultsCID: unit.testResultsCID,
                testResults: testResults
            };
        }));

        // Sort units by collection date (newest first)
        bloodUnits.sort((a, b) => b.collectedTimestamp - a.collectedTimestamp);

        // Store request details in IPFS for record-keeping
        const requestDetails = {
            patientName,
            bloodType: bloodType.toUpperCase(),
            rhType: rhType.toLowerCase(),
            hospitalId,
            timeRequested: timeRequested || new Date().toISOString(),
            matchingUnitsCount: bloodUnits.length,
            matchingUnitIds: bloodUnits.map(unit => unit.bloodUnitId)
        };

        const ipfsHandler = new IPFSHandler();
        const requestCid = await ipfsHandler.uploadTestResults(requestDetails);
        await ipfsHandler.pinContent(requestCid);

        res.json({
            success: true,
            request: requestDetails,
            requestCid: requestCid,
            matchingUnits: bloodUnits
        });
    } catch (error) {
        console.error('Error processing blood request:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
