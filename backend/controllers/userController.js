
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const UserVerification = require('../models/userVerificationModel');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const { sendVerificationEmail, sendVerificationSMS } = require('../utils/notificationUtils');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();
  const codeExpiry = new Date();
  codeExpiry.setHours(codeExpiry.getHours() + 24); // Code valid for 24 hours

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    verificationCode,
    verificationCodeExpiry: codeExpiry,
  });

  if (user) {
    // Create user verification record
    await UserVerification.create({
      user: user._id,
    });

    // Send verification email
    await sendVerificationEmail(email, name, verificationCode);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
      message: 'Registration successful! Please verify your email.',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Verify user email
// @route   POST /api/users/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error('Please provide email and verification code');
  }

  const user = await User.findOne({ 
    email,
    verificationCode: code,
    verificationCodeExpiry: { $gt: new Date() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  // Mark email as verified
  user.emailVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;
  await user.save();

  // Update verification record
  const userVerification = await UserVerification.findOne({ user: user._id });
  if (userVerification) {
    userVerification.emailVerified = true;
    userVerification.trustScore += 20; // Increase trust score
    await userVerification.save();
  }

  res.json({
    message: 'Email verified successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    },
  });
});

// @desc    Request phone verification
// @route   POST /api/users/verify-phone-request
// @access  Private
const requestPhoneVerification = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(400);
    throw new Error('Please provide a phone number');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();
  const codeExpiry = new Date();
  codeExpiry.setHours(codeExpiry.getHours() + 1); // Code valid for 1 hour

  user.phone = phone;
  user.verificationCode = verificationCode;
  user.verificationCodeExpiry = codeExpiry;
  await user.save();

  // Send SMS verification
  await sendVerificationSMS(phone, verificationCode);

  res.json({
    message: 'Verification code sent to your phone',
  });
});

// @desc    Verify phone number
// @route   POST /api/users/verify-phone
// @access  Private
const verifyPhone = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Please provide verification code');
  }

  const user = await User.findOne({ 
    _id: req.user._id,
    verificationCode: code,
    verificationCodeExpiry: { $gt: new Date() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  // Mark phone as verified
  user.phoneVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;
  await user.save();

  // Update verification record
  const userVerification = await UserVerification.findOne({ user: user._id });
  if (userVerification) {
    userVerification.phoneVerified = true;
    userVerification.trustScore += 20; // Increase trust score
    
    // Increase listing limit for phone-verified users
    if (!userVerification.listingLimit || userVerification.listingLimit < 5) {
      userVerification.listingLimit = 5;
    }
    
    await userVerification.save();
  }

  res.json({
    message: 'Phone verified successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
    },
  });
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  const verification = await UserVerification.findOne({ user: req.user._id });

  if (user) {
    res.json({
      ...user._doc,
      verificationDetails: verification || { trustScore: 0, listingLimit: 3 }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/update
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.email && req.body.email !== user.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.email = req.body.email;
      user.emailVerified = false;
      
      // Generate new verification code
      const verificationCode = generateVerificationCode();
      const codeExpiry = new Date();
      codeExpiry.setHours(codeExpiry.getHours() + 24);
      
      user.verificationCode = verificationCode;
      user.verificationCodeExpiry = codeExpiry;
      
      // Send verification email to new address
      await sendVerificationEmail(req.body.email, user.name, verificationCode);
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      emailVerified: updatedUser.emailVerified,
      phoneVerified: updatedUser.phoneVerified,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Submit identity verification
// @route   POST /api/users/verify-identity
// @access  Private
const submitIdentityVerification = asyncHandler(async (req, res) => {
  const { idType, idNumber, idImage } = req.body;

  if (!idType || !idNumber) {
    res.status(400);
    throw new Error('Please provide all required verification details');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get or create verification record
  let verification = await UserVerification.findOne({ user: req.user._id });
  if (!verification) {
    verification = new UserVerification({ user: req.user._id });
  }

  // Update verification details
  verification.identityDocument = `${idType}:${idNumber}`;
  verification.verificationStatus = 'pending';
  
  // In a real application, we would store the ID image
  // verification.identityImage = idImage;
  
  await verification.save();

  res.json({
    message: 'Identity verification submitted successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyEmail,
  requestPhoneVerification,
  verifyPhone,
  submitIdentityVerification,
};
