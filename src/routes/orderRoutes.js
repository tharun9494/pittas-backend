const express = require('express');
const router = express.Router();
const { placeOrder } = require('../controllers/orderController');

// Only keep the order placement route that triggers the phone call
router.post('/place', placeOrder);

module.exports = router; 