
const Property = require('../models/propertyModel');
const asyncHandler = require('express-async-handler');

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
    verificationDocuments,
  } = req.body;

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
    verificationStatus: 'pending',
    verificationDocuments: verificationDocuments || [],
  });

  res.status(201).json(property);
});

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  // Only return verified properties for public view
  const properties = await Property.find({ 
    available: true,
    verificationStatus: 'verified'
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

  // If verification documents are being updated, set status back to pending
  if (req.body.verificationDocuments) {
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

  await property.remove();
  res.json({ message: 'Property removed' });
});

// @desc    Verify a property (admin only)
// @route   PUT /api/properties/:id/verify
// @access  Private/Admin
const verifyProperty = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Update verification status
  property.verificationStatus = status;
  property.verificationNotes = notes || '';
  
  // If verified, set isVerified flag
  if (status === 'verified') {
    property.isVerified = true;
  } else {
    property.isVerified = false;
  }

  const updatedProperty = await property.save();
  res.json(updatedProperty);
});

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getUserProperties,
  updateProperty,
  deleteProperty,
  verifyProperty,
};
