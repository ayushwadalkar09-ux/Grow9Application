const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerSponsor,
  sponsorList,
  adminEarningStats,
  updateDailyPercentage,
  query,
} = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);
router.post("/sponserregisteration", authenticateToken, registerSponsor);
router.get("/sponserlist", authenticateToken, sponsorList);
router.get("/earnings/:interval", authenticateToken, adminEarningStats);
router.put("/percentageUpdate", authenticateToken, updateDailyPercentage);
router.post("/query", query);

module.exports = router;
