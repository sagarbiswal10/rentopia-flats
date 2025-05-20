
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
    rentAmount: {
      type: Number,
      required: true,
    },
    selectedServices: {
      packing: { type: Boolean, default: false },
      moving: { type: Boolean, default: false },
      cleaning: { type: Boolean, default: false },
      painting: { type: Boolean, default: false },
    },
    servicesAmount: {
      type: Number,
      default: 0,
    },
    monthlyPayments: [{
      month: Number, // 1-12 for the month
      year: Number,  // Year of payment
      status: {
        type: String,
        enum: ['pending', 'paid', 'late'],
        default: 'pending'
      },
      dueDate: Date,
      paidDate: Date,
      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    }],
    signedAgreement: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rental', rentalSchema);
