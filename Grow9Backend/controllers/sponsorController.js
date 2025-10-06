const bcrypt = require('bcryptjs');
const { sponsors } = require('../models/sponsorModel');
const { generateToken } = require('../config/jwt');

exports.loginSponsor = async (req, res) => {
  try {
    const { sponsorId, username, password } = req.body;

    if (!sponsorId || !username || !password)
      return res
        .status(400)
        .json({ message: 'Sponsor ID, username, and password are required' });

    const sponsor = sponsors.find(
      s => s.sponsorId === sponsorId && s.username === username
    );
    if (!sponsor)
      return res.status(401).json({ message: 'Invalid sponsor credentials' });

    const isPasswordValid = await bcrypt.compare(password, sponsor.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid sponsor credentials' });

    const token = generateToken(sponsor, 'sponsor');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: sponsor.id,
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
