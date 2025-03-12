
const Rental = require('../models/rentalModel');
const Property = require('../models/propertyModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new rental
// @route   POST /api/rentals
// @access  Private
const createRental = asyncHandler(async (req, res) => {
  const { propertyId, startDate, endDate, totalAmount } = req.body;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if property is available
  if (!property.available) {
    res.status(400);
    throw new Error('Property is not available for rent');
  }

  // Check if property is not owned by the current user
  if (property.user.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot rent your own property');
  }

  // Create rental
  const rental = await Rental.create({
    user: req.user._id,
    property: propertyId,
    paymentStatus: 'pending',
    startDate,
    endDate,
    status: 'active',
    totalAmount,
  });

  // Update property availability after rental creation
  property.available = false;
  await property.save();

  res.status(201).json(rental);
});

// @desc    Get user rentals
// @route   GET /api/rentals/user
// @access  Private
const getUserRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({ user: req.user._id })
    .populate('property')
    .sort({ createdAt: -1 });

  res.json(rentals);
});

// @desc    Get property owner's rentals
// @route   GET /api/rentals/property-owners
// @access  Private
const getPropertyOwnersRentals = asyncHandler(async (req, res) => {
  // First, get all properties owned by this user
  const properties = await Property.find({ user: req.user._id }).select('_id');
  
  // Get property IDs
  const propertyIds = properties.map(property => property._id);
  
  // Find all rentals for these properties
  const rentals = await Rental.find({ property: { $in: propertyIds } })
    .populate('property')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
  
  res.json(rentals);
});

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private
const getRentalById = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate('property')
    .populate('user', 'name email phone');

  if (rental) {
    // Check if user is authorized to view this rental
    if (rental.user._id.toString() !== req.user._id.toString() && 
        rental.property.user.toString() !== req.user._id.toString() && 
        !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to access this rental');
    }

    res.json(rental);
  } else {
    res.status(404);
    throw new Error('Rental not found');
  }
});

// @desc    Get all rentals (admin only)
// @route   GET /api/rentals
// @access  Private/Admin
const getAllRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({})
    .populate('property')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json(rentals);
});

// @desc    Update rental status
// @route   PUT /api/rentals/:id
// @access  Private
const updateRentalStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus, paymentId } = req.body;

  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Check if user is authorized (tenant or property owner or admin)
  const property = await Property.findById(rental.property);
  const isRenter = rental.user.toString() === req.user._id.toString();
  const isPropertyOwner = property && property.user.toString() === req.user._id.toString();
  
  if (!isRenter && !isPropertyOwner && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to update this rental');
  }

  // Update rental fields
  if (status) rental.status = status;
  if (paymentStatus) rental.paymentStatus = paymentStatus;
  if (paymentId) rental.paymentId = paymentId;

  // If rental status is changed to 'terminated' or 'expired', make property available again
  if ((status === 'terminated' || status === 'expired') && rental.status === 'active') {
    property.available = true;
    await property.save();
  }
  
  // If payment status changes to 'paid', update the property availability
  if (paymentStatus === 'paid' && rental.paymentStatus !== 'paid') {
    property.available = false;
    await property.save();
  }

  const updatedRental = await rental.save();

  res.json(updatedRental);
});

module.exports = {
  createRental,
  getUserRentals,
  getRentalById,
  getAllRentals,
  updateRentalStatus,
  getPropertyOwnersRentals,
};
