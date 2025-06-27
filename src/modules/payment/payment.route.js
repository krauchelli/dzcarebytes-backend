const express = require("express");
const paymentController = require("./payment.controller");

const router = express.Router();

// DOKU webhook callback (similar to your POC endpoint)
router.post("/callback/doku", paymentController.handleDokuCallback);

// Get payment status
router.get("/status/:billingId", paymentController.getPaymentStatus);

// 🧪 NEW: Standalone DOKU test endpoint
router.post("/test/doku", paymentController.testDokuPayment);

// 🧪 NEW: Test credentials endpoint
router.get("/test/credentials", paymentController.testDokuCredentials);


module.exports = router;