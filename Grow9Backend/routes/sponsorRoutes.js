const express = require('express');
const router = express.Router();
const { loginSponsor, customerRegistration ,customerList , updateCustomerAmount , earningStats} = require('../controllers/sponsorController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', loginSponsor);
router.post('/customerRegister', authenticateToken, customerRegistration);
router.get('/customerlist/:sponsorId', authenticateToken, customerList);
router.get('/earnings/:sponsorId/:interval', authenticateToken, earningStats);
router.put('/updateCustomerAmount', authenticateToken, updateCustomerAmount);

module.exports = router;
