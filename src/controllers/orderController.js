const { notifyAdminOnOrder } = require('../services/twilioService');
const Order = require('../models/Order');

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Handle new order placement and trigger phone call
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function placeOrder(req, res) {
    try {
        const { customerName, phone, amount, items, address } = req.body;

        // Validate required fields
        if (!customerName || !phone || !amount || !items || !address) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: customerName, phone, amount, items, and address are required'
            });
        }

        // Validate phone number format
        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Validate order amount
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Order amount must be a positive number'
            });
        }

        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items must be a non-empty array'
            });
        }

        // Generate order ID
        const orderId = `ORD${Date.now()}`;

        // Create new order in Firebase
        const order = await Order.create({
            orderId,
            customerName,
            phone,
            amount,
            items,
            address
        });

        // Notify admin about the new order via phone call
        try {
            await notifyAdminOnOrder({
                orderId,
                customerName,
                phone,
                amount,
                items,
                address
            });
            console.log('✅ Phone call notification sent successfully');
        } catch (notificationError) {
            console.error('❌ Failed to send phone call notification:', notificationError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully and admin notified',
            orderId
        });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing order',
            error: error.message
        });
    }
}

module.exports = {
    placeOrder
}; 