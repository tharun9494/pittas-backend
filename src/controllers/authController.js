const { admin } = require('../config/firebase');

/**
 * Login user and get Firebase ID token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Get user by email
        const userRecord = await admin.auth().getUserByEmail(email);
        
        // Create custom token
        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                customToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid email or password',
            error: error.message
        });
    }
}

/**
 * Register new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function register(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required'
            });
        }

        // Create user
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
            emailVerified: false
        });

        // Create custom token
        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                customToken
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        
        if (error.code === 'auth/invalid-email') {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        if (error.code === 'auth/weak-password') {
            return res.status(400).json({
                success: false,
                message: 'Password is too weak'
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
}

module.exports = {
    login,
    register
}; 