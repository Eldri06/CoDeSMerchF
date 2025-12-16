import admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// Check if already initialized to avoid "already exists" error in serverless
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
  });
  console.log('✅ Firebase Realtime Database initialized successfully');
}

const db = admin.database(); // Realtime Database
const auth = admin.auth();

export { admin, db, auth };
