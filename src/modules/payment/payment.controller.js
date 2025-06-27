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


// 🧪 NEW: Test DOKU payment creation standalone
const testDokuPayment = async (req, res, next) => {
  try {
    console.log('🧪 === STANDALONE DOKU TEST START ===');
    
    // Use EXACT payload from DOKU documentation
    const dokuExamplePayload = {
      "order": {
        "amount": req.body.amount || 20000,
        "invoice_number": req.body.invoice_number || "INV-20210231-0001"
      },
      "payment": {
        "payment_due_date": 60
      }
    };

    console.log('🧪 Using DOKU documentation example payload:', JSON.stringify(dokuExamplePayload, null, 2));

    // Call DOKU directly with minimal payload
    const result = await paymentService.createPaymentLinkMinimal(dokuExamplePayload);

    console.log('🧪 === STANDALONE DOKU TEST SUCCESS ===');

    res.status(200).json({
      statusCode: 200,
      message: 'DOKU payment test successful (Documentation Example)',
      data: {
        payment_url: result.redirect_url || result.payment_url,
        session_id: result.order?.session_id,
        qr_code: result.qr_code,
        example_payload: dokuExamplePayload,
        full_response: result
      }
    });
  } catch (error) {
    console.error('🧪 === STANDALONE DOKU TEST FAILED ===');
    console.error('Error:', error.message);
    
    res.status(500).json({
      statusCode: 500,
      message: 'DOKU payment test failed (Documentation Example)',
      error: error.message,
      example_payload: {
        "order": {
          "amount": 20000,
          "invoice_number": "INV-20210231-0001"
        },
        "payment": {
          "payment_due_date": 60
        }
      },
      details: {
        doku_credentials_present: {
          client_id: !!process.env.DOKU_CLIENT_ID,
          secret_key: !!process.env.DOKU_SECRET_KEY,
          base_url: process.env.DOKU_BASE_URL
        }
      }
    });
  }
};

// 🧪 NEW: Test DOKU credentials
const testDokuCredentials = async (req, res, next) => {
  try {
    const credentials = {
      doku_base_url: process.env.DOKU_BASE_URL || 'NOT_SET',
      doku_client_id: process.env.DOKU_CLIENT_ID ? 
        `${process.env.DOKU_CLIENT_ID.substring(0, 8)}...` : 'NOT_SET',
      doku_secret_key: process.env.DOKU_SECRET_KEY ? 
        `${process.env.DOKU_SECRET_KEY.substring(0, 8)}...` : 'NOT_SET',
      all_present: !!(process.env.DOKU_CLIENT_ID && process.env.DOKU_SECRET_KEY)
    };

    res.status(200).json({
      statusCode: 200,
      message: 'DOKU credentials check',
      data: credentials,
      ready_for_testing: credentials.all_present
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleDokuCallback,
  getPaymentStatus,
  testDokuPayment,      // 🧪 NEW
  testDokuCredentials   // 🧪 NEW
};