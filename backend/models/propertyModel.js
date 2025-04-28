
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationDocuments: {
      type: [String],
      default: [],
    },
    verificationNotes: {
      type: String,
      default: '',
    },
    // Enhanced fraud prevention fields
    ownershipProof: {
      type: String,
      default: '',
    },
    propertyId: {
      type: String, // Legal property identification number
      default: '',
    },
    addressVerified: {
      type: Boolean,
      default: false,
    },
    lastPhysicalVerification: {
      type: Date,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    fraudFlags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
