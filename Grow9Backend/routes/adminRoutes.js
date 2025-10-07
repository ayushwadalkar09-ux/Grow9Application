const express = require('express');
const router = express.Router();
const { loginAdmin , registerSponsor } = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.post('/sponserregisteration',authenticateToken,registerSponsor)


module.exports = router;
