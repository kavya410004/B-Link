import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { pool } from './db';
import session from 'express-session';

// Passport configuration
export const configurePassport = (app) => {
    // Session middleware
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Blood Bank Strategy
    passport.use('blood-bank-local', new LocalStrategy({
        usernameField: 'bloodBankId',
        passwordField: 'password'
    }, async (bloodBankId, password, done) => {
        try {
            const result = await pool.query(
                'SELECT * FROM blood_bank_auth WHERE blood_bank_id = $1',
                [bloodBankId]
            );

            if (result.rows.length === 0) {
                return done(null, false, { message: 'Invalid blood bank ID' });
            }

            const bloodBank = result.rows[0];
            const isValid = await bcrypt.compare(password, bloodBank.password_hash);

            if (!isValid) {
                return done(null, false, { message: 'Invalid password' });
            }

            return done(null, { 
                id: bloodBank.blood_bank_id,
                name: bloodBank.name,
                role: 'blood_bank'
            });
        } catch (error) {
            return done(error);
        }
    }));

    // Hospital Strategy
    passport.use('hospital-local', new LocalStrategy({
        usernameField: 'hospitalId',
        passwordField: 'password'
    }, async (hospitalId, password, done) => {
        try {
            const result = await pool.query(
                'SELECT * FROM hospital_auth WHERE hospital_id = $1',
                [hospitalId]
            );

            if (result.rows.length === 0) {
                return done(null, false, { message: 'Invalid hospital ID' });
            }

            const hospital = result.rows[0];
            const isValid = await bcrypt.compare(password, hospital.password_hash);

            if (!isValid) {
                return done(null, false, { message: 'Invalid password' });
            }

            return done(null, { 
                id: hospital.hospital_id,
                name: hospital.name,
                role: 'hospital'
            });
        } catch (error) {
            return done(error);
        }
    }));

    // Serialize user
    passport.serializeUser((user, done) => {
        done(null, { id: user.id, role: user.role });
    });

    // Deserialize user
    passport.deserializeUser(async (data, done) => {
        try {
            const { id, role } = data;
            let query;
            let params;

            if (role === 'blood_bank') {
                query = 'SELECT blood_bank_id as id, name, city, role FROM blood_bank_auth WHERE blood_bank_id = $1';
                params = [id];
            } else {
                query = 'SELECT hospital_id as id, name, city, role FROM hospital_auth WHERE hospital_id = $1';
                params = [id];
            }

            const result = await pool.query(query, params);
            if (result.rows.length === 0) {
                return done(null, false);
            }

            const user = result.rows[0];
            user.role = role;
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

// Authentication middleware
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Authentication required' });
};

export const isBloodBank = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'blood_bank') {
        return next();
    }
    res.status(403).json({ error: 'Blood bank access required' });
};

export const isHospital = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'hospital') {
        return next();
    }
    res.status(403).json({ error: 'Hospital access required' });
};

// Registration functions
export const registerBloodBank = async (req, res) => {
    try {
        const { name, licenseNumber, city, password, contactNumber, email } = req.body;

        // Validate required fields
        if (!name || !licenseNumber || !city || !password) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        // Generate unique bloodBankId (BB + 6 digits)
        const bloodBankId = 'BB' + Math.floor(100000 + Math.random() * 900000).toString();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store in database
        await pool.query(
            'INSERT INTO blood_bank_auth (blood_bank_id, password_hash, name, license_number, city, contact_number, email) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [bloodBankId, hashedPassword, name, licenseNumber, city, contactNumber, email]
        );

        res.json({ 
            success: true, 
            bloodBankId,
            message: 'Blood bank registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const registerHospital = async (req, res) => {
    try {
        const { name, city, password, contactNumber, email } = req.body;

        // Validate required fields
        if (!name || !city || !password) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        // Generate unique hospitalId (H + 6 digits)
        const hospitalId = 'H' + Math.floor(100000 + Math.random() * 900000).toString();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store in database
        await pool.query(
            'INSERT INTO hospital_auth (hospital_id, password_hash, name, city, contact_number, email) VALUES ($1, $2, $3, $4, $5, $6)',
            [hospitalId, hashedPassword, name, city, contactNumber, email]
        );

        res.json({ 
            success: true, 
            hospitalId,
            message: 'Hospital registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Login routes
export const loginBloodBank = (req, res, next) => {
    passport.authenticate('blood-bank-local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info.message || 'Authentication failed' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ 
                success: true, 
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role
                }
            });
        });
    })(req, res, next);
};

export const loginHospital = (req, res, next) => {
    passport.authenticate('hospital-local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info.message || 'Authentication failed' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ 
                success: true, 
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role
                }
            });
        });
    })(req, res, next);
};

// Logout route
export const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
};

export default {
    configurePassport,
    isAuthenticated,
    isBloodBank,
    isHospital,
    registerBloodBank,
    registerHospital,
    loginBloodBank,
    loginHospital,
    logout
};
