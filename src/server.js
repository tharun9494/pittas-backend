require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const orderRoutes = require('./routes/orderRoutes');

// Initialize Firebase
const { admin, db } = require('./config/firebase');

const app = express();

// Security Middleware
app.use(helmet());
app.use(morgan('dev'));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors());

// API Routes
app.use('/api/orders', orderRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString()
    });
});

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the Order Notification API',
        version: '1.0.0',
        endpoints: {
            placeOrder: 'POST /api/orders/place',
            health: 'GET /health'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

try {
    app.listen(PORT, () => {
        console.log(`
🚀 Server is running!
📝 Environment: ${process.env.NODE_ENV || 'development'}
🔌 Port: ${PORT}
📡 API URL: http://localhost:${PORT}
        `);
    });
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}