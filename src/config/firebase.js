const admin = require('firebase-admin');

// Firebase configuration
const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

let adminApp;
let db;

try {
    // Check if Firebase is already initialized
    if (!admin.apps.length) {
        adminApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
    } else {
        adminApp = admin.app();
    }

    db = adminApp.firestore();
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    // Create a mock db for development if Firebase fails to initialize
    db = {
        collection: () => ({
            doc: () => ({
                set: async () => ({ id: 'mock-id' }),
                get: async () => ({ exists: false }),
                update: async () => ({}),
                delete: async () => ({})
            }),
            orderBy: () => ({
                get: async () => ({ docs: [] })
            })
        })
    };
    console.log('⚠️ Using mock Firebase database');
}

module.exports = { admin, db, firebaseConfig }; 