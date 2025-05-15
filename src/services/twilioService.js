const twilio = require('twilio');

// Debug: Log environment variables (without sensitive data)
console.log('🔍 Twilio Configuration Check:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('TWILIO_FLOW_SID:', process.env.TWILIO_FLOW_SID ? '✅ Set' : '❌ Missing');
console.log('ADMIN_PHONE_NUMBER:', process.env.ADMIN_PHONE_NUMBER ? '✅ Set' : '❌ Missing');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? '✅ Set' : '❌ Missing');

// Initialize Twilio client with proper error handling
let client;
try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.warn('⚠️ Twilio credentials are not configured. Notifications will be disabled.');
        throw new Error('Twilio credentials are not configured');
    }
    
    client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio client initialized successfully');
} catch (error) {
    console.error('❌ Error initializing Twilio client:', error.message);
    // Create a mock client for development if credentials are missing
    client = {
        studio: {
            v2: {
                flows: () => ({
                    executions: {
                        create: async () => {
                            console.log('📞 Mock notification sent (Twilio not configured)');
                            return {
                                sid: 'mock_sid',
                                status: 'mock_status'
                            };
                        }
                    }
                })
            }
        }
    };
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
    try {
        const { orderId, customerName, phone, amount, items, address } = orderData;
        
        // Format items list for the call
        const itemsList = items.map(item => `${item.name} - ${item.quantity}`).join(', ');
        
        // Create the call using Twilio Studio Flow
        const call = await client.studio.v2.flows(process.env.TWILIO_FLOW_SID)
            .executions
            .create({
                to: process.env.ADMIN_PHONE_NUMBER,
                from: process.env.TWILIO_PHONE_NUMBER,
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
        throw error;
    }
}

module.exports = {
    notifyAdminOnOrder
}; 