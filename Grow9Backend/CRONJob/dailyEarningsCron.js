import cron from "node-cron";
import dotenv from "dotenv";
import Customer from "../models/customerModel.js";
import SponsorDailyEarning from "../models/SponsorDailyEarningModel.js"; 

dotenv.config();

// Percentage increase for the day (you can set this dynamically)
const todaysPercentageIncrease = 0.05; // 5% increase example

// ────────────────────────────────
// CRON Job: Runs every 24 hours (00:00 midnight)
// ────────────────────────────────
cron.schedule("33 17 * * *", async () => {
  console.log("🚀 Running daily sponsor earnings job at:", new Date().toISOString());

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
    for (const customer of totalCustomerList){
      const updatedCustomer = await Customer.findOneAndUpdate(
        { 
          sponsorId: customer.sponsorId, 
          email: customer.email, 
          mobileNumber: customer.mobileNumber 
        },
        { $set: { AmountInvested: (customer.AmountInvested + (todaysPercentageIncrease * customer.AmountInvested)) } },
        { new: true }
      );
    }


    console.log("✅ Daily sponsor earnings updated successfully.");
  } catch (err) {
    console.error("❌ Error updating sponsor earnings:", err);
  }
});
