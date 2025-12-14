let sgMail;
try {
  sgMail = require('@sendgrid/mail');
} catch {}

function getSmtpTransport() {
  const useSmtp = String(process.env.USE_SMTP || '').toLowerCase() === 'true';
  if (!useSmtp) return null;
  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch {
    return null;
  }
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

async function sendUsingSendgrid({ to, subject, text }) {
  const key = process.env.SENDGRID_API_KEY;
  if (!sgMail || !key) return { success: false, message: 'SendGrid not configured' };
  try {
    sgMail.setApiKey(key);
    const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'CoDeSMerch <no-reply@codesmerch.local>';
    await sgMail.send({ to, from, subject, text });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function sendEmail({ to, subject, text }) {
  const provider = String(process.env.EMAIL_PROVIDER || '').toLowerCase();
  if (provider === 'sendgrid') {
    const res = await sendUsingSendgrid({ to, subject, text });
    if (res.success) return res;
  }
  try {
    const transporter = getSmtpTransport();
    if (!transporter) {
      console.log(`✉️ Email (mock): to=${to} subject=${subject}`);
      return { success: false, message: 'Email transport not configured' };
    }
    const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || 'CoDeSMerch <no-reply@codesmerch.local>';
    await transporter.sendMail({ from, to, subject, text });
    return { success: true };
  } catch (e) {
    console.error('Email send error:', e);
    return { success: false, error: e.message };
  }
}

module.exports = { sendEmail };
