
const nodemailer = require('nodemailer');
const twilio = require('twilio');

/**
 * Send email verification link to user
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationCode - Verification code
 */
const sendVerificationEmail = async (email, name, verificationCode) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?code=${verificationCode}&email=${encodeURIComponent(email)}`;

    // Email content
    const mailOptions = {
      from: `"RentEasy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - RentEasy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">RentEasy Email Verification</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with RentEasy. To complete your registration and verify your email address, please use the following verification code:</p>
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${verificationCode}</strong>
          </div>
          <p>Alternatively, you can click the button below to verify your email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p>If you did not sign up for RentEasy, please ignore this email.</p>
          <p>Thank you,<br>The RentEasy Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

/**
 * Send SMS verification code to user
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} verificationCode - Verification code
 */
const sendVerificationSMS = async (phoneNumber, verificationCode) => {
  try {
    // Check if Twilio credentials are configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.error('Twilio credentials not configured');
      return false;
    }

    // Format phone number for Twilio (ensure it has the country code)
    let formattedNumber = phoneNumber.trim();
    
    // For Indian numbers, ensure +91 prefix
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '+91' + formattedNumber.slice(1);
    } else if (formattedNumber.startsWith('91')) {
      formattedNumber = '+' + formattedNumber;
    } else if (!formattedNumber.startsWith('+')) {
      // If no country code, assume Indian number
      formattedNumber = '+91' + formattedNumber;
    }
    
    console.log(`Sending SMS to formatted number: ${formattedNumber}`);

    // Create Twilio client
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Send SMS
    await client.messages.create({
      body: `Your RentEasy verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    console.log(`Verification SMS sent to ${formattedNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerificationSMS,
};
