const Payment = require('../models/paymentModel');
const Property = require('../models/propertyModel');
const Rental = require('../models/rentalModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const { rentalId, propertyId, amount, paymentMethod } = req.body;

  let property;
  let rental;

  // If rentalId is provided, use it to get the rental and property
  if (rentalId) {
    rental = await Rental.findById(rentalId).populate('property');
    if (!rental) {
      res.status(404);
      throw new Error('Rental not found');
    }
    property = rental.property;
  } else if (propertyId) {
    // Fallback to propertyId if no rentalId
    property = await Property.findById(propertyId);
    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }
  } else {
    res.status(400);
    throw new Error('Either rentalId or propertyId must be provided');
  }

  // Create payment
  const payment = await Payment.create({
    user: req.user._id,
    property: property._id,
    rental: rental ? rental._id : null,
    amount,
    paymentMethod,
    status: 'completed',
  });

  // If rental exists, update its payment status
  if (rental) {
    rental.paymentStatus = 'paid';
    rental.paymentId = payment._id;
    await rental.save();

    // Update property availability
    property.available = false;
    await property.save();
  }

  res.status(201).json(payment);
});

// @desc    Get a payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Check user ownership or property owner
  const property = await Property.findById(payment.property);
  if (
    payment.user.toString() !== req.user._id.toString() &&
    property.user.toString() !== req.user._id.toString()
  ) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.json(payment);
});

// @desc    Get payments by user
// @route   GET /api/payments/user
// @access  Private
const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(payments);
});

module.exports = {
  createPayment,
  getPaymentById,
  getUserPayments,
};
