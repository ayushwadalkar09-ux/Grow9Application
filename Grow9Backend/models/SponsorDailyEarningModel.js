const mongoose = require('mongoose');

// Subdocument schema for each earnings entry
const earningsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  earnings: {
    type: Number,
    required: true,
  },
  displayDate: {
    type: String,
  },
});

// Main schema
const sponsorDailyEarningSchema = new mongoose.Schema({
  SponsorID: {
    type: String,
    required: true,
    unique: true,
  },
  records: [earningsSchema],
}, { timestamps: true });

// Auto-generate displayDate before saving
sponsorDailyEarningSchema.pre("save", function (next) {
  this.records.forEach((record) => {
    if (!record.displayDate && record.date) {
      const dateObj = new Date(record.date);
      record.displayDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  });
  next();
});

module.exports = mongoose.model("SponsorDailyEarning", sponsorDailyEarningSchema);
