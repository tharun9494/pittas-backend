const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const orderRoutes = require('./routes/orderRoutes');
const config = require('./config/config');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/orders', orderRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
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

// Function to start server with port fallback
const startServer = (port) => {
    const server = app.listen(port)
        .on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use, trying ${port + 1}`);
                startServer(port + 1);
            } else {
                console.error('Failed to start server:', error);
                process.exit(1);
            }
        })
        .on('listening', () => {
            console.log(`Server running on port ${port}`);
        });
};

// Start server with initial port
startServer(config.port);