const paymentService = require('./payment.service');

const handleDokuCallback = async (req, res, next) => {
  try {
    const result = await paymentService.processDokuNotification(req.body, req.headers);
    
    res.status(result.statusCode).json({
      statusCode: result.statusCode,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentStatus = async (req, res, next) => {
  try {
    const billing = await paymentService.getPaymentStatus(req.params.billingId);

    res.status(200).json({
      statusCode: 200,
      message: 'Payment status retrieved successfully',
      data: {
        billing_id: billing.id,
        status: billing.status,
        total_price: billing.total_price,
        payment_link: billing.payment_link,
        patient_name: billing.patient.name,
        payment_processed_at: billing.payment_processed_at
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleDokuCallback,
  getPaymentStatus
};