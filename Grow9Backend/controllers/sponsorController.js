const bcrypt = require('bcryptjs');
const Sponsor = require('../models/SponsorRegisterationModel');
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
    console.log(sponsor);
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, sponsor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid sponsor credentials' });
    }
    console.log("ENter 1");
    // Generate JWT token
    const token = generateToken(sponsor, 'sponsor');
    console.log("ENter 1");
    // Respond
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        sponsorId: sponsor.sponsorId,
        username: sponsor.username,
        type: 'sponsor',
      },
    });
  } catch (error) {
    console.error('Sponsor login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
