const { auth, db } = require('../config/firebase');

async function verifyToken(req, res, next) {
  try {
    const header = req.headers['authorization'] || '';
    const parts = header.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
    if (!token) return res.status(401).json({ success: false, error: 'Missing Authorization Bearer token' });
    const decoded = await auth.verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email || '' };
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

async function requireSuperAdmin(req, res, next) {
  try {
    if (!req.user?.uid) return res.status(401).json({ success: false, error: 'Unauthenticated' });
    const snap = await db.ref(`users/${req.user.uid}`).once('value');
    const user = snap.val() || {};
    const presetEmail = String(process.env.PRESIDENT_EMAIL || '').trim().toLowerCase();
    const isSuper = String(user.systemRole || '').toLowerCase() === 'super_admin' || (presetEmail && String(req.user.email || '').toLowerCase() === presetEmail);
    if (!isSuper) return res.status(403).json({ success: false, error: 'Requires super admin' });
    next();
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}

module.exports = { verifyToken, requireSuperAdmin };
