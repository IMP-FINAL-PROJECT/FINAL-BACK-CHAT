import 'firebase/compat/firestore';
import admin from 'firebase-admin';
import adminKey from '../../key/adminKey.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase
const app = admin.initializeApp({
    credential: admin.credential.cert(adminKey),
});

const firestore = app.firestore();

console.log('Firebase Connect');

export { firestore };
