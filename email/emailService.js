// NEW FEATURE: Email Alert System
const nodemailer = require('nodemailer');


let transporter = null;

// Initialize email transporter
function initializeEmailService() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email service disabled: Missing environment variables');
    return false;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  console.log('Email service initialized');
  return true;
}

// Send alert email to admin users
async function sendAlertEmail(alert) {
  if (!transporter) return;

  try {
    // Get all admin users
    const result = await pool.query(
      "SELECT email, full_name FROM users WHERE role = 'Admin'"
    );

    if (result.rows.length === 0) return;

    const adminEmails = result.rows.map(u => u.email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails.join(','),
      subject: `🚨 ${alert.severity} Alert - Module ${alert.module_no}`,
      html: `
        <h2 style="color: #ef4444;">Fire Monitoring System Alert</h2>
        <p><strong>Module Number:</strong> ${alert.module_no}</p>
        <p><strong>Alert Type:</strong> ${alert.alert_type}</p>
        <p><strong>Severity:</strong> ${alert.severity}</p>
        <p><strong>Value:</strong> ${alert.value}</p>
        <p><strong>Threshold:</strong> ${alert.threshold}</p>
        <p><strong>Message:</strong> ${alert.message}</p>
        <p><strong>Timestamp:</strong> ${new Date(alert.created_at).toLocaleString()}</p>
        <hr>
        <p style="color: #666;">This is an automated alert from the Fire Monitoring System.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent for module ${alert.module_no}`);
  } catch (error) {
    console.error('Email send error:', error.message);
  }
}

module.exports = { initializeEmailService, sendAlertEmail };
