
const mongoose = require('mongoose');

const rentalSchema = mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    startDate: {
      type: Date,
      required: [true, 'Please specify rental start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please specify rental end date'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'terminated'],
      default: 'active',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rental', rentalSchema);
