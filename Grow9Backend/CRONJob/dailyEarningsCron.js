const cron = require("node-cron");
const dotenv = require("dotenv");
const Customer = require("../models/customerModel");
const SponsorDailyEarning = require("../models/SponsorDailyEarningModel");
const AdminDailyGrowthPercentage = require("../models/dailyGrowthPercentageModel");

dotenv.config();

let todaysPercentageIncrease = 0;
(async () => {
  try {
    let DailyPercentageGrowth = await AdminDailyGrowthPercentage.find();
    if (!DailyPercentageGrowth.length) {
      DailyPercentageGrowth = [{ Percentage: 0 }];
    }

    DailyPercentageGrowth = DailyPercentageGrowth[0].Percentage;

    todaysPercentageIncrease = DailyPercentageGrowth / 100;
    console.log("Today's Growth Percentage:", todaysPercentageIncrease);
  } catch (error) {
    console.error("Error in dailyEarningsCron:", error);
  }
})();

// ────────────────────────────────
// CRON Job: Runs every 24 hours (00:00 midnight)
// ────────────────────────────────
cron.schedule("08 16 * * *", async () => {
  console.log(
    "🚀 Running daily sponsor earnings job at:",
    new Date().toISOString()
  );

  try {
    const sponsorTotals = await Customer.aggregate([
      {
        $group: {
          _id: "$sponsorId",
          totalInvested: { $sum: "$AmountInvested" },
        },
      },
    ]);
    for (const sponsor of sponsorTotals) {
      const sponsorID = sponsor._id;
      const totalInvested = sponsor.totalInvested;
      const earnings = totalInvested * todaysPercentageIncrease;

      const today = new Date();
      const displayDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      await SponsorDailyEarning.findOneAndUpdate(
        { SponsorID: sponsorID },
        {
          $push: {
            records: {
              date: today,
              earnings,
              displayDate,
            },
          },
        },
        { upsert: true, new: true }
      );
    }

    //Update Customer Principal Amount
    const totalCustomerList = await Customer.find();
    console.log(totalCustomerList);
    for (const customer of totalCustomerList) {
      const updatedCustomer = await Customer.findOneAndUpdate(
        {
          sponsorId: customer.sponsorId,
          email: customer.email,
          mobileNumber: customer.mobileNumber,
        },
        {
          $set: {
            AmountInvested:
              customer.AmountInvested +
              todaysPercentageIncrease * customer.AmountInvested,
          },
        },
        { new: true }
      );
    }

    console.log("✅ Daily sponsor earnings updated successfully.");
  } catch (err) {
    console.error("❌ Error updating sponsor earnings:", err);
  }
});
