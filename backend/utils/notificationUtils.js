const nodemailer = require('nodemailer');

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
 * Send SMS verification code to user with Fast2SMS API
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} verificationCode - Verification code
 */
const sendVerificationSMS = async (phoneNumber, verificationCode) => {
  try {
    // Clean the phone number - keep only digits
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Ensure it's a valid Indian number - should be 10 digits or with 91 prefix
    let mobileNumber = cleanNumber;
    if (cleanNumber.startsWith('91') && cleanNumber.length > 10) {
      mobileNumber = cleanNumber.slice(2); // Remove 91 prefix if present
    } else if (cleanNumber.startsWith('0')) {
      mobileNumber = cleanNumber.slice(1); // Remove leading 0 if present
    }
    
    // Check if it's a valid 10-digit number
    if (mobileNumber.length !== 10) {
      console.error(`Invalid phone number format: ${phoneNumber}`);
      return false;
    }
    
    console.log(`Sending verification SMS to ${mobileNumber}: Your verification code is ${verificationCode}`);
    
    // In production: Uncomment and configure this with your SMS gateway provider
    // This is an example for Fast2SMS API (popular in India)
    /*
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Authorization': 'YOUR_FAST2SMS_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: verificationCode,
        numbers: mobileNumber,
      })
    });
    
    const data = await response.json();
    if (data.return === true) {
      console.log(`SMS sent successfully to ${mobileNumber}`);
      return true;
    } else {
      console.error('SMS sending failed:', data);
      return false;
    }
    */
    
    // Since we don't have an actual SMS gateway configured yet,
    // we'll return the code in development mode for testing
    // This should be removed in production and replaced with actual SMS sending
    if (process.env.NODE_ENV === 'development') {
      console.log(`DEVELOPMENT MODE: SMS code for ${mobileNumber} is ${verificationCode}`);
      return true;
    } else {
      // In production without SMS gateway configured, we log an error
      console.error('SMS gateway not configured. Cannot send SMS.');
      return false;
    }
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerificationSMS,
};
