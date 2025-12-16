import express from 'express';
const router = express.Router();
import { auth, db } from '../config/firebase.js';
import { sendEmail } from '../utils/email.js';
import { verifyToken, requireSuperAdmin } from '../middleware/auth.js';

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
          fullName: req.body.fullName || userRecord.displayName,
          role: isPresident ? 'president' : (needsApproval ? 'member' : (requestedRole || 'member')),
          requestedRole: needsApproval ? requestedRole : '',
          studentId: req.body.studentId || '',
          phone: req.body.phone || '',
          organization: 'Computer Debuggers Society',
          department: 'Department of Computing Education',
          status: isPresident ? 'active' : (needsApproval ? 'pending' : 'active'),
          systemRole: isPresident ? 'super_admin' : (needsApproval ? '' : 'member'),
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };
        await db.ref(`users/${userRecord.uid}`).update(profile);
        res.json({ success: true, message: needsApproval ? 'Profile updated. Approval needed.' : 'Profile updated successfully', uid: userRecord.uid });
        return;
      } catch (e2) {
        console.error('Update on existing user failed:', e2);
      }
    }

    res.status(500).json({ success: false, error: error.message });
  }
});

// Login (optional if using client SDK, but good for admin)
router.post('/login', async (req, res) => {
  res.status(501).json({ message: 'Use client-side Firebase Auth for login' });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });
  
  try {
    const link = await auth.generatePasswordResetLink(email);
    // Send email with link
    await sendEmail({ to: email, subject: 'CoDeSMerch: Password Reset', text: `Click here to reset your password: ${link}` });
    res.json({ success: true, message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
