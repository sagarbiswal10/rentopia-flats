
const mongoose = require('mongoose');

const userVerificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    identityVerified: {
      type: Boolean,
      default: false,
    },
    identityDocument: {
      type: String,
    },
    verificationDate: {
      type: Date,
    },
    verificationNotes: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    trustScore: {
      type: Number,
      default: 0, // 0-100 score
    },
    listingLimit: {
      type: Number,
      default: 3, // Default limit for new users
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserVerification', userVerificationSchema);
