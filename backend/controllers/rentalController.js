
const Rental = require('../models/rentalModel');
const Property = require('../models/propertyModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new rental
// @route   POST /api/rentals
// @access  Private
const createRental = asyncHandler(async (req, res) => {
  const { propertyId, paymentId, startDate, endDate } = req.body;

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

  // Create rental
  const rental = await Rental.create({
    property: propertyId,
    user: req.user._id,
    payment: paymentId,
    startDate,
    endDate,
  });

  // Update property availability
  property.available = false;
  await property.save();

  // Populate property details
  const populatedRental = await Rental.findById(rental._id)
    .populate('property')
    .populate('payment');

  res.status(201).json(populatedRental);
});

// @desc    Get rentals by user
// @route   GET /api/rentals/user
// @access  Private
const getUserRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({ user: req.user._id })
    .populate('property')
    .populate('payment')
    .sort({ createdAt: -1 });

  res.json(rentals);
});

// @desc    Get a rental by ID
// @route   GET /api/rentals/:id
// @access  Private
const getRentalById = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate('property')
    .populate('payment');

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Check user ownership or property owner
  if (
    rental.user.toString() !== req.user._id.toString() &&
    rental.property.user.toString() !== req.user._id.toString()
  ) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.json(rental);
});

module.exports = {
  createRental,
  getUserRentals,
  getRentalById,
};
