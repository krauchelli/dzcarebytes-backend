const express = require("express");
const paymentController = require("./payment.controller");

const router = express.Router();

// DOKU webhook callback (similar to your POC endpoint)
router.post("/callback/doku", paymentController.handleDokuCallback);

// Get payment status
router.get("/status/:billingId", paymentController.getPaymentStatus);

module.exports = router;