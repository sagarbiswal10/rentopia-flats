const Property = require('../models/propertyModel');
const UserVerification = require('../models/userVerificationModel');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// Default property images
const defaultPropertyImages = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop'
];

// Generate type-specific images
const getTypeBasedImages = (type) => {
  switch(type) {
    case 'apartment':
      return [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&auto=format&fit=crop'
      ];
    case 'house':
      return [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop'
      ];
    case 'villa':
      return [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop'
      ];
    case 'condo':
      return [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=800&auto=format&fit=crop'
      ];
    case 'office':
      return [
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&auto=format&fit=crop'
      ];
    default:
      return defaultPropertyImages;
  }
};

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
  
  // Provide default images based on property type if none are specified
  const propertyImages = images && images.length > 0 ? 
    images : getTypeBasedImages(type);
  
  const propertyThumbnail = thumbnailUrl || 
    (propertyImages.length > 0 ? propertyImages[0] : '/placeholder.svg');
  
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
    images: propertyImages,
    thumbnailUrl: propertyThumbnail,
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

// @desc    Upload property images
// @route   POST /api/properties/:id/images
// @access  Private
const uploadPropertyImages = asyncHandler(async (req, res) => {
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

  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  // Create file paths for database
  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
  
  // Set thumbnail to first image if none exists
  if (!property.thumbnailUrl || property.thumbnailUrl === '/placeholder.svg') {
    property.thumbnailUrl = imagePaths[0];
  }

  // Add new images to existing ones
  property.images = [...property.images.filter(img => !img.includes('unsplash.com') && img !== '/placeholder.svg'), ...imagePaths];

  await property.save();

  res.status(200).json({
    success: true,
    images: property.images,
    thumbnailUrl: property.thumbnailUrl
  });
});

// @desc    Upload rental agreement
// @route   POST /api/properties/:id/agreement
// @access  Private
const uploadRentalAgreement = asyncHandler(async (req, res) => {
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

  // Check if file was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('No agreement uploaded');
  }

  // Create file path for database
  const agreementPath = `/uploads/${req.file.filename}`;
  property.rentalAgreement = agreementPath;

  await property.save();

  res.status(200).json({
    success: true,
    rentalAgreement: property.rentalAgreement
  });
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
  uploadPropertyImages,
  uploadRentalAgreement,
};
