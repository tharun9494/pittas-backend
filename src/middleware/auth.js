const { admin } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token - now passes through without verification
 */
const authenticateUser = async (req, res, next) => {
    // Add default user info to request
    req.user = {
        uid: 'anonymous',
        email: 'anonymous@example.com',
        role: 'user'
    };
    next();
};

/**
 * Middleware to check if user has admin role - now always allows access
 */
const isAdmin = (req, res, next) => {
    next();
};

module.exports = {
    authenticateUser,
    isAdmin
};