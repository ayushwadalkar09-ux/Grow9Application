const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  sponsorId: {
    type: String,
    ref: 'Sponsor',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  AmountInvested: {
    type: Number,
    default: 0
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);