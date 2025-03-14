
const Payment = require('../models/paymentModel');
const Property = require('../models/propertyModel');
const Rental = require('../models/rentalModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const { propertyId, amount, paymentMethod } = req.body;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if property is already rented and payment completed by someone else
  const existingCompletedRental = await Rental.findOne({
    property: propertyId,
    paymentStatus: 'paid',
    status: 'active'
  });

  if (existingCompletedRental) {
    res.status(400);
    throw new Error('Property is already rented');
  }

  // Create payment
  const payment = await Payment.create({
    user: req.user._id,
    property: propertyId,
    amount,
    paymentMethod,
    status: 'completed', // For simplicity, in a real app, this would be integrated with a payment gateway
  });

  // Find user's pending rental for this property
  const userRental = await Rental.findOne({
    property: propertyId,
    user: req.user._id,
    status: 'active',
    paymentStatus: 'pending'
  });

  if (userRental) {
    // Update rental payment status
    userRental.paymentStatus = 'paid';
    userRental.paymentId = payment._id;
    await userRental.save();

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
