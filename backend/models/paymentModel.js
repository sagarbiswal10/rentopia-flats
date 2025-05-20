
const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property',
    },
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental',
    },
    amount: {
      type: Number,
      required: [true, 'Please specify payment amount'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please specify payment method'],
      enum: ['card', 'upi', 'wallet', 'bank_transfer'],
    },
    paymentType: {
      type: String,
      enum: ['rent', 'deposit', 'service', 'booking_fee'],
      default: 'rent',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    transactionId: {
      type: String,
      default: function() {
        return 'txn_' + Date.now() + Math.floor(Math.random() * 1000);
      },
    },
    monthlyPaymentDetails: {
      month: Number,
      year: Number,
    },
    serviceDetails: {
      packing: Boolean,
      moving: Boolean,
      cleaning: Boolean,
      painting: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
