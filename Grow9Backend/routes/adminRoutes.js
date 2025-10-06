const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);

router.get('/dashboard', authenticateToken, (req, res) => {
  if (req.user.type !== 'admin')
    return res.status(403).json({ message: 'Admin access required' });
  res.status(200).json({ message: 'Welcome to admin dashboard' });
});

module.exports = router;
