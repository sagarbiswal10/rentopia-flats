
const nodemailer = require('nodemailer');
const twilio = require('twilio');

/**
 * Sends an email using Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML format
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async (to, subject, html) => {
  // For production, you would use actual SMTP credentials
  // This example uses a testing service (Ethereal) for development
  const testAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || testAccount.user,
      pass: process.env.SMTP_PASS || testAccount.pass,
    },
  });
  
  // Send email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Rentopia" <noreply@rentopia.com>',
    to,
    subject,
    html,
  });
  
  // If using Ethereal for testing, log the preview URL
  if (!process.env.SMTP_HOST) {
    console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
  
  return info;
};

/**
 * Sends an SMS using Twilio
 * @param {string} to - Recipient phone number
 * @param {string} message - SMS message content
 * @returns {Promise} - Promise that resolves when SMS is sent
 */
const sendSMS = async (to, message) => {
  // Skip if Twilio credentials are not set
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('Twilio credentials not configured. SMS would be sent to:', to);
    console.log('Message:', message);
    return null;
  }
  
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  const response = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
  
  return response;
};

module.exports = {
  sendEmail,
  sendSMS,
};
