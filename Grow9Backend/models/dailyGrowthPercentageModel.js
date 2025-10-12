const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AdminDailyGrowthPercentage = new mongoose.Schema({
  Percentage: {
    type: Number,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminDailyGrowthPercentage', AdminDailyGrowthPercentage );
