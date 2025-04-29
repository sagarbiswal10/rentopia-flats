
const Property = require('../models/propertyModel');
const UserVerification = require('../models/userVerificationModel');
const asyncHandler = require('express-async-handler');

// Utility function to check for suspicious pricing
const checkSuspiciousPricing = async (rent, type, city) => {
  // Get average rent for similar properties
  const averageRent = await Property.aggregate([
    { 
      $match: { 
        type: type, 
        city: city,
        verificationStatus: 'verified'
      } 
    },
    { 
      $group: { 
        _id: null, 
        averageRent: { $avg: "$rent" } 
      } 
    }
  ]);

  if (averageRent.length > 0) {
    const avgRent = averageRent[0].averageRent;
    // If rent is less than 40% of average, it might be suspicious
    if (rent < (avgRent * 0.4)) {
      return true;
    }
  }
  return false;
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private
const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    bedrooms,
    bathrooms,
    furnishing,
    rent,
    deposit,
    area,
    locality,
    city,
    state,
    amenities,
    images,
    thumbnailUrl,
  } = req.body;

  // Check user verification status
  let userVerification = await UserVerification.findOne({ user: req.user._id });
  
  // If no verification record exists, create one
  if (!userVerification) {
    userVerification = await UserVerification.create({
      user: req.user._id,
      emailVerified: true, // Since they registered with email
    });
  }

  // Check listing limits for user
  const userListingsCount = await Property.countDocuments({ user: req.user._id });
  if (userListingsCount >= userVerification.listingLimit) {
    res.status(400);
    throw new Error(`You have reached your listing limit of ${userVerification.listingLimit}. Please verify your account to increase your limit.`);
  }

  // Basic content validation
  if (description.length < 50) {
    res.status(400);
    throw new Error('Description is too short. Please provide a detailed description of at least 50 characters.');
  }

  // Check for suspicious pricing
  const isSuspicious = await checkSuspiciousPricing(rent, type, city);
  
  // Create property
  const property = await Property.create({
    user: req.user._id,
    title,
    description,
    type,
    bedrooms,
    bathrooms,
    furnishing,
    rent,
    deposit,
    area,
    locality,
    city,
    state,
    amenities: amenities || [],
    images: images || [],
    thumbnailUrl: thumbnailUrl || '',
    // Fraud prevention fields
    suspiciousFlags: isSuspicious ? 1 : 0,
    // If user is verified, auto-verify their property
    verificationStatus: userVerification.identityVerified ? 'verified' : 'pending',
  });

  res.status(201).json(property);
});

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  // Only show verified or pending properties (not rejected)
  const properties = await Property.find({ 
    available: true,
    verificationStatus: { $ne: 'rejected' }
  }).sort({ createdAt: -1 });

  res.json(properties);
});

// @desc    Get a property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    res.json(property);
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

// @desc    Get properties by user
// @route   GET /api/properties/user
// @access  Private
const getUserProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(properties);
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check user ownership
  if (property.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // If property was verified and significant fields are being changed, reset verification
  const significantFields = ['rent', 'deposit', 'bedrooms', 'bathrooms', 'area', 'locality', 'city'];
  const isSignificantChange = significantFields.some(field => 
    req.body[field] !== undefined && property[field] !== req.body[field]
  );

  if (property.verificationStatus === 'verified' && isSignificantChange) {
    req.body.verificationStatus = 'pending';
  }

  // Update property
  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedProperty);
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check user ownership
  if (property.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: 'Property removed' });
});

// @desc    Report a property
// @route   POST /api/properties/:id/report
// @access  Private
const reportProperty = asyncHandler(async (req, res) => {
  const { reason, details } = req.body;
  
  if (!reason) {
    res.status(400);
    throw new Error('Please provide a reason for reporting');
  }

  const property = await Property.findById(req.params.id);
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if user already reported this property
  const alreadyReported = property.reports.some(
    report => report.user.toString() === req.user._id.toString()
  );

  if (alreadyReported) {
    res.status(400);
    throw new Error('You have already reported this property');
  }

  // Add report
  property.reports.push({
    user: req.user._id,
    reason,
    details: details || '',
    date: Date.now(),
    status: 'pending',
  });

  property.reportCount = property.reports.length;

  // If report count exceeds threshold, mark property for review
  if (property.reportCount >= 3 && property.verificationStatus !== 'rejected') {
    property.verificationStatus = 'pending';
  }

  await property.save();

  res.status(201).json({ message: 'Property reported successfully' });
});

// @desc    Verify user's identity
// @route   POST /api/users/verify-identity
// @access  Private
const verifyUserIdentity = asyncHandler(async (req, res) => {
  const { documentType, documentNumber } = req.body;
  
  if (!documentType || !documentNumber) {
    res.status(400);
    throw new Error('Please provide required verification details');
  }

  let userVerification = await UserVerification.findOne({ user: req.user._id });
  
  if (!userVerification) {
    userVerification = new UserVerification({ user: req.user._id });
  }

  userVerification.identityDocument = `${documentType}:${documentNumber}`;
  userVerification.verificationStatus = 'pending';
  
  await userVerification.save();

  res.status(200).json({ message: 'Identity verification submitted successfully' });
});

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getUserProperties,
  updateProperty,
  deleteProperty,
  reportProperty,
  verifyUserIdentity,
};
