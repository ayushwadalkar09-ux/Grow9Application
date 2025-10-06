const express = require('express');
const router = express.Router();
const { loginSponsor } = require('../controllers/sponsorController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', loginSponsor);

router.get('/dashboard', authenticateToken, (req, res) => {
  if (req.user.type !== 'sponsor')
    return res.status(403).json({ message: 'Sponsor access required' });
  res.status(200).json({ message: 'Welcome to sponsor dashboard' });
});

module.exports = router;
