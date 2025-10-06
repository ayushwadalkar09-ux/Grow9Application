const bcrypt = require('bcryptjs');
const { admins } = require('../models/adminModel');
const { generateToken } = require('../config/jwt');

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    const admin = admins.find(a => a.username === username);
    if (!admin) return res.status(401).json({ message: 'Invalid admin credentials' });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = generateToken(admin, 'admin');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: admin.id, username: admin.username, type: 'admin' },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
