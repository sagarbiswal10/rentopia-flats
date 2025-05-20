
const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    type: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['apartment', 'house', 'villa', 'condo', 'office'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
    },
    furnishing: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished',
    },
    rent: {
      type: Number,
      required: [true, 'Please specify rent amount'],
    },
    deposit: {
      type: Number,
      required: [true, 'Please specify security deposit amount'],
    },
    area: {
      type: Number,
      required: [true, 'Please specify property area'],
    },
    locality: {
      type: String,
      required: [true, 'Please specify locality'],
    },
    city: {
      type: String,
      required: [true, 'Please specify city'],
    },
    state: {
      type: String,
      required: [true, 'Please specify state'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    rentalAgreement: {
      type: String,
      default: '',
    },
    additionalServices: {
      packing: {
        available: { type: Boolean, default: true },
        price: { type: Number, default: 2000 }
      },
      moving: {
        available: { type: Boolean, default: true },
        price: { type: Number, default: 5000 }
      },
      cleaning: {
        available: { type: Boolean, default: true },
        price: { type: Number, default: 1500 }
      },
      painting: {
        available: { type: Boolean, default: true },
        price: { type: Number, default: 8000 }
      }
    },
    // Added fraud prevention fields
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationDate: {
      type: Date,
    },
    verificationNotes: {
      type: String,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reason: {
          type: String,
          required: true,
        },
        details: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'reviewed', 'dismissed'],
          default: 'pending',
        },
      },
    ],
    addressVerified: {
      type: Boolean,
      default: false,
    },
    suspiciousFlags: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
