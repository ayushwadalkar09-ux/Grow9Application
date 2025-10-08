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
    console.log("Sponser"+sponsor)
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
