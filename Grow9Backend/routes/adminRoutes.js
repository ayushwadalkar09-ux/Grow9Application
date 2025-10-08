const express = require('express');
const router = express.Router();
const { loginAdmin , registerSponsor , sponsorList } = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.post('/sponserregisteration',authenticateToken,registerSponsor)
router.get('/sponserlist',authenticateToken,sponsorList)


module.exports = router;
