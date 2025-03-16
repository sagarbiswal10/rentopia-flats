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
  });

  res.status(201).json(property);
});

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ available: true })
    .sort({ createdAt: -1 });

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
  console.log(`Fetching properties for user: ${req.user._id}`);
  const properties = await Property.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  console.log(`Found ${properties.length} properties for user`);
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

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getUserProperties,
  updateProperty,
  deleteProperty,
};
