const express = require("express");
const billingController = require("./billing.controller");
const { authenticateToken, authorizeRoles } = require("../../middlewares/auth.middleware");

const router = express.Router();

// Generate billing from completed scheduling (REAL FLOW)
router.post("/generate/scheduling/:schedulingId", 
  authenticateToken, 
  authorizeRoles("ADMIN", "DOCTOR"), 
  billingController.generateBillingFromScheduling
);

// Mock billing for testing
router.post("/mock", billingController.generateMockBilling);

module.exports = router;