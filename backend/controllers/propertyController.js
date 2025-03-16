
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
  try {
    console.log('Fetching all properties');
    const properties = await Property.find({})
      .sort({ createdAt: -1 });
    
    console.log(`Found ${properties.length} properties, ${properties.filter(p => p.available).length} available`);
    res.json(properties);
  } catch (error) {
    console.error('Error in getProperties:', error);
    res.status(500);
    throw new Error('Server error when fetching properties');
  }
});

// @desc    Get a property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  try {
    console.log(`Fetching property by ID: ${req.params.id}`);
    const property = await Property.findById(req.params.id);

    if (property) {
      res.json(property);
    } else {
      res.status(404);
      throw new Error('Property not found');
    }
  } catch (error) {
    console.error(`Error fetching property ${req.params.id}:`, error);
    if (error.kind === 'ObjectId') {
      res.status(404);
      throw new Error('Property not found - invalid ID format');
    }
    throw error;
  }
});

// @desc    Get properties by user
// @route   GET /api/properties/user
// @access  Private
const getUserProperties = asyncHandler(async (req, res) => {
  try {
    console.log(`Fetching properties for user: ${req.user._id}`);
    const properties = await Property.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    console.log(`Found ${properties.length} properties for user`);
    res.json(properties);
  } catch (error) {
    console.error('Error in getUserProperties:', error);
    res.status(500);
    throw new Error('Server error when fetching user properties');
  }
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = asyncHandler(async (req, res) => {
  try {
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

    console.log(`Property ${req.params.id} updated, available: ${updatedProperty.available}`);
    res.json(updatedProperty);
  } catch (error) {
    console.error(`Error updating property ${req.params.id}:`, error);
    throw error;
  }
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = asyncHandler(async (req, res) => {
  try {
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

    await Property.deleteOne({ _id: req.params.id });
    console.log(`Property ${req.params.id} deleted`);
    res.json({ message: 'Property removed' });
  } catch (error) {
    console.error(`Error deleting property ${req.params.id}:`, error);
    throw error;
  }
});

// @desc    Update property availability
// @route   PUT /api/properties/:id/availability
// @access  Private
const updatePropertyAvailability = asyncHandler(async (req, res) => {
  try {
    const { available } = req.body;
    
    if (typeof available !== 'boolean') {
      res.status(400);
      throw new Error('Available status must be a boolean');
    }
    
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
    
    property.available = available;
    await property.save();
    
    console.log(`Property ${req.params.id} availability updated to: ${available}`);
    res.json(property);
  } catch (error) {
    console.error(`Error updating property availability ${req.params.id}:`, error);
    throw error;
  }
});

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getUserProperties,
  updateProperty,
  deleteProperty,
  updatePropertyAvailability,
};
