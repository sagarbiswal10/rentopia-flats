
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
    amount: {
      type: Number,
      required: [true, 'Please specify payment amount'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please specify payment method'],
      enum: ['card', 'upi', 'wallet'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    transactionId: {
      type: String,
      default: function() {
        return 'txn_' + Date.now() + Math.floor(Math.random() * 1000);
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
