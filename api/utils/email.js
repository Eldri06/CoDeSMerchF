import sgMail from '@sendgrid/mail';

function getSmtpTransport() {
  const useSmtp = String(process.env.USE_SMTP || '').toLowerCase() === 'true';
  if (!useSmtp) return null;
  // Dynamic import for nodemailer if needed, or assume it's not available in this env
  // Since we are moving to Vercel, we prefer SendGrid or HTTP based email services.
  // For now, we return null if nodemailer is not available.
  return null;
}

async function sendUsingSendgrid({ to, subject, text }) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return { success: false, message: 'SendGrid not configured' };
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
  
  // Fallback to console log if no provider works
  console.log(`✉️ Email (mock): to=${to} subject=${subject}`);
  return { success: true, message: 'Email logged (mock)' };
}

export { sendEmail };
