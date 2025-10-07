const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sponsorSchema = new mongoose.Schema({
  sponsorId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()  // This generates UUID automatically when document is created
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobNumber: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sponsor', sponsorSchema);
