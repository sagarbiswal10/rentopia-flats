
const Rental = require('../models/rentalModel');
const Property = require('../models/propertyModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new rental
// @route   POST /api/rentals
// @access  Private
const createRental = asyncHandler(async (req, res) => {
  const { propertyId, startDate, endDate, paymentId } = req.body;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Create rental
  const rental = await Rental.create({
    user: req.user._id,
    property: propertyId,
    startDate,
    endDate,
    paymentId,
    status: 'active',
  });

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

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private
const getRentalById = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate('property')
    .populate('user', 'name email phone');

  if (rental) {
    // Check if user is authorized to view this rental
    if (rental.user._id.toString() !== req.user._id.toString()) {
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
  const { status } = req.body;

  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Check if user is authorized
  if (rental.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this rental');
  }

  rental.status = status || rental.status;
  const updatedRental = await rental.save();

  res.json(updatedRental);
});

module.exports = {
  createRental,
  getUserRentals,
  getRentalById,
  getAllRentals,
  updateRentalStatus,
};
