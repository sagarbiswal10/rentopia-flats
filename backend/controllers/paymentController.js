
const Payment = require('../models/paymentModel');
const Property = require('../models/propertyModel');
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

  // Check if property is available
  if (!property.available) {
    res.status(400);
    throw new Error('Property is not available for rent');
  }

  // Create payment
  const payment = await Payment.create({
    user: req.user._id,
    property: propertyId,
    amount,
    paymentMethod,
    status: 'completed', // For simplicity, in a real app, this would be integrated with a payment gateway
  });

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
