const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth routes working!' });
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role, studentId, phone } = req.body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, password, and full name are required' 
      });
    }

    // Validate UMTC email
    if (!email.endsWith('@umtc.edu.ph')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please use your UMTC email (@umtc.edu.ph)' 
      });
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
    });

    // Store additional user data in Realtime Database
    await db.ref(`users/${userRecord.uid}`).set({
      uid: userRecord.uid,
      email,
      fullName,
      role: role || 'member',
      studentId: studentId || '',
      phone: phone || '',
      organization: 'Computer Debuggers Society',
      department: 'Department of Computing Education',
      status: 'active',
      systemRole: 'officer',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    });

    console.log(`✅ User registered: ${email}`);

    res.json({ 
      success: true, 
      message: 'User registered successfully',
      uid: userRecord.uid 
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already in use' 
      });
    }
    
    if (error.code === 'auth/invalid-password') {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Login verification
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user data from database
    const userSnapshot = await db.ref(`users/${userRecord.uid}`).once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        error: 'User data not found' 
      });
    }

    // Check if user is active
    if (userData.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        error: 'Account is not active. Please contact admin.' 
      });
    }

    // Update last active
    await db.ref(`users/${userRecord.uid}`).update({
      lastActive: new Date().toISOString()
    });

    console.log(`✅ User logged in: ${email}`);

    res.json({ 
      success: true, 
      user: {
        uid: userRecord.uid,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        systemRole: userData.systemRole || 'officer',
      }
    });
  } catch (error) {
    console.error('❌ Login verification error:', error);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get user profile
router.get('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const userSnapshot = await db.ref(`users/${uid}`).once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { uid } = req.body;

    if (uid) {
      await db.ref(`users/${uid}`).update({
        lastActive: new Date().toISOString()
      });
    }

    console.log(`✅ User logged out: ${uid}`);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;