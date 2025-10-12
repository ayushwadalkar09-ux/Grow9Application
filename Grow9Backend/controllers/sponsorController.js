const bcrypt = require('bcryptjs');
const Sponsor = require('../models/SponsorRegisterationModel');
const Customer = require('../models/customerModel');
const SponsorDailyEarning = require('../models/SponsorDailyEarningModel');
const { generateToken } = require('../config/jwt');

exports.loginSponsor = async (req, res) => {
  try {
    const { sponsorId, username, password } = req.body;

    // Validate input
    if (!sponsorId || !username || !password) {
      return res.status(400).json({
        message: 'Sponsor ID, username, and password are required',
      });
    }

    // Find sponsor in MongoDB
    const sponsor = await Sponsor.findOne({ sponsorId});
    if (!sponsor) {
      return res.status(401).json({ message: 'Invalid sponsor credentials' });
    }
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, sponsor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid sponsor credentials' });
    }
    // Generate JWT token
    const token = generateToken(sponsor, 'sponsor');
    // Respond
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        sponsorId: sponsor.sponsorId,
        username: sponsor.name,
        type: 'sponsor',
      },
    });
  } catch (error) {
    console.error('Sponsor login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.customerRegistration = async (req, res) => {
  try {
    const { sponsorId, name, mobileNumber, email, dateOfBirth } = req.body;

    // Validate required fields
    if (!sponsorId || !name || !mobileNumber || !email || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate mobile number
    if (!validateMobileNumber(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if sponsor exists
    const sponsor = await Sponsor.findOne({ sponsorId});
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: 'Sponsor not found'
      });
    }

    // Check if email already exists
    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if mobile number already exists
    const existingMobile = await Customer.findOne({ mobileNumber });
    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message: 'Mobile number already registered'
      });
    }

    // Validate date of birth
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date of birth'
      });
    }


    // Create new customer
    const customer = new Customer({
      sponsorId,
      name,
      mobileNumber,
      email,
      dateOfBirth: dob,
      registeredAt: new Date()
    });

    // Save customer to database
    await customer.save();

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      customerId: customer.customerId,
      data: {
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again later.'
    });
  }
}

exports.customerList = async (req, res) => {
  try {
    const { sponsorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Validate sponsorId
    if (!sponsorId || sponsorId.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sponsor ID is required'
      });
    }
    // Verify sponsor exists
    const sponsor = await Sponsor.findOne({sponsorId});
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: 'Sponsor not found'
      });
    }
    // Fetch paginated customers
    const customers = await Customer.find({ sponsorId })
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit);
    // Get total count for pagination
    const totalCount = await Customer.countDocuments({ sponsorId });
    // Format response
    const formattedCustomers = customers.map(customer => ({
      name: customer.name,
      email: customer.email,
      phone: customer.mobileNumber,
      dateOfBirth:customer.dateOfBirth,
      AmountInvested:customer.AmountInvested,
      joinDate: customer.registeredAt.toISOString().split('T')[0]
    }));

    return res.status(200).json({
      success: true,
      message: 'Customers fetched successfully',
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      customers: formattedCustomers
    });

  } catch (error) {
    console.error('Fetch paginated customer list error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching customer list'
    });
  }
}

exports.updateCustomerAmount = async (req, res) => {
  try {
    const { amount, sponsorId , email , mobileNumber } = req.body;

    // ✅ Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount value' });
    }
    if (!sponsorId) {
      return res.status(400).json({ message: 'Sponsor ID is required' });
    }


    const updatedCustomer = await Customer.findOneAndUpdate(
      { sponsorId, email, mobileNumber },
      { $set: { AmountInvested: amount } },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found for this sponsor' });
    }

    return res.status(200).json({
      message: 'Amount updated successfully',
      customer: updatedCustomer,
    });

  } catch (error) {
    console.error('Error updating amount:', error);
    res.status(500).json({ message: 'Server error while updating amount' });
  }
};



const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateMobileNumber = (mobileNumber) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  const cleanMobile = mobileNumber.replace(/[^\d]/g, '');
  return mobileRegex.test(cleanMobile);
};


exports.earningStats = async (req, res) => {
  const { sponsorId , interval } = req.params;

  try {
    // 1️⃣ Find earnings document for the sponsor
    const record = await SponsorDailyEarning.findOne({ SponsorID: sponsorId });

    if (!record) {
      return res.status(404).json({ message: "No earnings found for this sponsor" });
    }

    // 2️⃣ Filter based on time range
    const now = new Date();
    let daysToShow = interval === '7days' ? 7 : interval === '30days' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(now.getDate() - daysToShow);

    const filteredRecords = record.records.filter(r => new Date(r.date) >= startDate);

     // 4️⃣ Map records to same format as mock data
    const formattedData = filteredRecords.map(r => ({
      date: new Date(r.date).toISOString().split('T')[0],
      earnings: r.earnings,
      displayDate: r.displayDate || new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

   

    //Total Invested Amount 
    const result = await Customer.aggregate([
      { $match: { sponsorId: sponsorId } },          
      { $group: { _id: null, totalInvested: { $sum: "$AmountInvested" } } }
     ]);

    const totalInvested = result[0]?.totalInvested || 0;
     // 5️⃣ Compute stats
    const stats = calculateStats(formattedData,totalInvested);

    // 4️⃣ Respond with structured data
    return res.status(200).json({
      dailyEarnings: formattedData,
      stats,
      totalinvestment:totalInvested,
    });
  } catch (err) {
    console.error("Error fetching sponsor earnings:", err);
    return res.status(500).json({ message: "Server error fetching earnings", error: err.message });
  }
};

// 🔹 Helper function to calculate stats
const calculateStats = (records,totalInvested) => {
  const totalEarnings = records.reduce((sum, r) => sum + r.earnings, 0);

  return {
    totalEarnings,
    totalinvestment : totalInvested,
    daysCount: records.length,
  };
};