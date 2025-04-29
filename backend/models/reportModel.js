
const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reported: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    type: {
      type: String,
      required: true,
      enum: ['user', 'property'],
    },
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending',
    },
    resolution: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
