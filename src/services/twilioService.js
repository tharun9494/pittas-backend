const twilio = require('twilio');
const config = require('../config/config');

// Debug: Log environment variables (without sensitive data)
console.log('🔍 Twilio Configuration Check:');
console.log('TWILIO_ACCOUNT_SID:', config.twilio.accountSid ? '✅ Set' : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', config.twilio.authToken ? '✅ Set' : '❌ Missing');
console.log('TWILIO_FLOW_SID:', config.twilio.flowSid ? '✅ Set' : '❌ Missing');
console.log('ADMIN_PHONE_NUMBER:', config.twilio.adminPhoneNumber ? '✅ Set' : '❌ Missing');
console.log('TWILIO_PHONE_NUMBER:', config.twilio.twilioPhoneNumber ? '✅ Set' : '❌ Missing');

// Initialize Twilio client with proper error handling
let client;
try {
    if (!config.twilio.accountSid || !config.twilio.authToken) {
        console.warn('⚠️ Twilio credentials are not configured. Notifications will be disabled.');
        client = null;
    } else {
        client = twilio(
            config.twilio.accountSid,
            config.twilio.authToken
        );
        console.log('✅ Twilio client initialized successfully');
    }
} catch (error) {
    console.error('❌ Error initializing Twilio client:', error.message);
    client = null;
}

/**
 * Notify admin about a new order via phone call
 * @param {Object} orderData - Order data
 * @param {string} orderData.orderId - Order ID
 * @param {string} orderData.customerName - Customer name
 * @param {string} orderData.phone - Customer phone number
 * @param {number} orderData.amount - Order amount
 * @param {Array} orderData.items - Order items
 * @param {string} orderData.address - Delivery address
 */
async function notifyAdminOnOrder(orderData) {
    if (!client) {
        console.log('📞 Mock notification sent (Twilio not configured)');
        return {
            sid: 'mock_sid',
            status: 'mock_status'
        };
    }

    try {
        const { orderId, customerName, phone, amount, items, address } = orderData;
        
        // Format items list for the call
        const itemsList = items.map(item => `${item.name} - ${item.quantity}`).join(', ');
        
        // Create the call using Twilio Studio Flow
        const call = await client.studio.v2.flows(config.twilio.flowSid)
            .executions
            .create({
                to: config.twilio.adminPhoneNumber,
                from: config.twilio.twilioPhoneNumber,
                parameters: {
                    orderId,
                    customerName,
                    customerPhone: phone,
                    orderAmount: amount.toString(),
                    itemsList,
                    deliveryAddress: address
                }
            });

        console.log('Call initiated:', call.sid);
        return call;
    } catch (error) {
        console.error('Error initiating call:', error);
        // Return a mock response instead of throwing
        return {
            sid: 'error_sid',
            status: 'error',
            error: error.message
        };
    }
}

module.exports = {
    notifyAdminOnOrder
}; 