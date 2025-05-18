require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        flowSid: process.env.TWILIO_FLOW_SID,
        adminPhoneNumber: process.env.ADMIN_PHONE_NUMBER,
        twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER
    }
};

// Validate required environment variables
const requiredEnvVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_FLOW_SID',
    'ADMIN_PHONE_NUMBER',
    'TWILIO_PHONE_NUMBER'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('Please check your .env file and ensure all required variables are set.');
}

module.exports = config; 