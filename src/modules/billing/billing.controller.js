const billingService = require('./billing.service');

const generateBillingFromScheduling = async (req, res, next) => {
  try {
    const { schedulingId } = req.params;
    
    const result = await billingService.generateBillingFromCompletedScheduling(schedulingId);
    
    res.status(201).json({
      statusCode: 201,
      message: 'Billing generated successfully from completed appointment',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Keep existing mock billing for testing
const generateMockBilling = async (req, res, next) => {
  // ... existing mock implementation
};

module.exports = {
  generateBillingFromScheduling,
  generateMockBilling
};