const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');
const { sendEmail } = require('../utils/email');
const { verifyToken, requireSuperAdmin } = require('../middleware/auth');

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

    // Validate email domain via ALLOWED_EMAIL_DOMAINS
    const allowedDomains = String(process.env.ALLOWED_EMAIL_DOMAINS || '')
      .split(',')
      .map(d => d.trim().toLowerCase())
      .filter(Boolean);
    const allowAll = allowedDomains.includes('*') || allowedDomains.length === 0;
    if (!allowAll) {
      const okDomain = allowedDomains.some(d => email.toLowerCase().endsWith(`@${d}`));
      if (!okDomain) {
        return res.status(400).json({ success: false, error: `Email domain not allowed. Allowed: ${allowedDomains.join(', ')}` });
      }
    }

    // Create Firebase Auth user or fetch if already exists
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
      });
    } catch (e) {
      if (e.code === 'auth/email-already-exists') {
        userRecord = await auth.getUserByEmail(email);
      } else {
        throw e;
      }
    }

    const presidentEmail = String(process.env.PRESIDENT_EMAIL || '').trim().toLowerCase();
    const isPresident = presidentEmail && email.toLowerCase() === presidentEmail;
    const requestedRole = String(role || '').toLowerCase();
    const needsApproval = !isPresident && requestedRole && requestedRole !== 'member';

    const profile = {
      uid: userRecord.uid,
      email,
      fullName,
      role: isPresident ? 'president' : (needsApproval ? 'member' : (role || 'member')),
      requestedRole: needsApproval ? role : '',
      studentId: studentId || '',
      phone: phone || '',
      organization: 'Computer Debuggers Society',
      department: 'Department of Computing Education',
      status: isPresident ? 'active' : (needsApproval ? 'pending' : 'active'),
      systemRole: isPresident ? 'super_admin' : (needsApproval ? '' : 'member'),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    await db.ref(`users/${userRecord.uid}`).set(profile);

    console.log(`✅ User registered: ${email}`);

    // Email notifications
    try {
      if (needsApproval) {
        await sendEmail({ to: email, subject: 'CoDeSMerch: Approval Requested', text: 'Your credentials have been requested for approval by the President. You will receive an update once reviewed.' });
      } else {
        await sendEmail({ to: email, subject: 'CoDeSMerch: Activated', text: 'Your account is active as Super Admin. You can now sign in.' });
      }
    } catch {}

    res.json({ success: true, message: needsApproval ? 'Request submitted. Approval will be required.' : 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      try {
        const userRecord = await auth.getUserByEmail(String(req.body.email || '').trim().toLowerCase());
        const presidentEmail = String(process.env.PRESIDENT_EMAIL || '').trim().toLowerCase();
        const isPresident = presidentEmail && userRecord.email.toLowerCase() === presidentEmail;
        const requestedRole = String(req.body.role || '').toLowerCase();
        const needsApproval = !isPresident && requestedRole && requestedRole !== 'member';
        const profile = {
          uid: userRecord.uid,
          email: userRecord.email,
          fullName: req.body.fullName || userRecord.displayName || '',
          role: isPresident ? 'president' : (needsApproval ? 'member' : (req.body.role || 'member')),
          requestedRole: needsApproval ? req.body.role : '',
          studentId: req.body.studentId || '',
          phone: req.body.phone || '',
          organization: 'Computer Debuggers Society',
          department: 'Department of Computing Education',
          status: isPresident ? 'active' : (needsApproval ? 'pending' : 'active'),
          systemRole: isPresident ? 'super_admin' : (needsApproval ? 'member' : 'officer'),
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };
        await db.ref(`users/${userRecord.uid}`).set(profile);
        return res.json({ success: true, message: needsApproval ? 'Request submitted. Approval will be required.' : 'User registered successfully', uid: userRecord.uid });
      } catch (e2) {
        return res.status(500).json({ success: false, error: e2.message });
      }
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

    // Check status and message
    if (String(userData.status || '').toLowerCase() !== 'active') {
      const msg = String(userData.status || '').toLowerCase() === 'pending' ? 'Credentials pending approval' : 'Account is not active';
      return res.status(403).json({ success: false, error: msg });
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

// Approval management
router.get('/requests', verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const snap = await db.ref('users').once('value');
    const pending = [];
    snap.forEach(child => {
      const v = child.val();
      if (String(v.status || '').toLowerCase() === 'pending') {
        pending.push({ uid: child.key, email: v.email, fullName: v.fullName, requestedRole: v.requestedRole || '' });
      }
    });
    res.json({ success: true, data: pending });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/approve', verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const { uid, grantedRole } = req.body;
    const userSnap = await db.ref(`users/${uid}`).once('value');
    if (!userSnap.exists()) return res.status(404).json({ success: false, error: 'User not found' });
    const v = userSnap.val();
    const finalRole = String(grantedRole || v.requestedRole || 'member');
    const finalSystemRole = finalRole.toLowerCase() === 'president' ? 'super_admin' : finalRole;
    await db.ref(`users/${uid}`).update({ status: 'active', role: finalRole, systemRole: finalSystemRole, requestedRole: '' });
    await sendEmail({ to: v.email, subject: 'CoDeSMerch: Approved', text: 'Your credentials have been approved. You may now sign in and access the app.' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/reject', verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const { uid } = req.body;
    const userSnap = await db.ref(`users/${uid}`).once('value');
    if (!userSnap.exists()) return res.status(404).json({ success: false, error: 'User not found' });
    const v = userSnap.val();
    await db.ref(`users/${uid}`).update({ status: 'active', role: 'member', systemRole: 'member', requestedRole: '' });
    await sendEmail({ to: v.email, subject: 'CoDeSMerch: Rejected', text: 'Your credentials request has been rejected. Your role is set to Member with limited access.' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    let link = '';
    try {
      link = await auth.generatePasswordResetLink(String(email).trim().toLowerCase());
    } catch (e) {}
    try {
      if (link) {
        await sendEmail({ to: email, subject: 'CoDeSMerch: Reset Password', text: `Use this link to reset your password: ${link}` });
      }
    } catch {}
    return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  }
});

router.post('/admin/delete-user', async (req, res) => {
  try {
    const headerKey = req.headers['x-admin-key'];
    const envKey = String(process.env.ADMIN_MAINT_KEY || '').trim();
    if (!envKey || String(headerKey || '').trim() !== envKey) return res.status(403).json({ success: false, error: 'Forbidden' });
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });
    const userRecord = await auth.getUserByEmail(String(email).trim().toLowerCase());
    await auth.deleteUser(userRecord.uid);
    await db.ref(`users/${userRecord.uid}`).remove();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
