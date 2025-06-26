const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../../config/prismaClient');

// DOKU Configuration
const DOKU_BASE_URL = process.env.DOKU_BASE_URL || 'https://api-sandbox.doku.com';
const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID;
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY;
console.log('🔧 DEBUG: DOKU_BASE_URL:', DOKU_BASE_URL);
console.log('🔧 DEBUG: DOKU_CLIENT_ID:', DOKU_CLIENT_ID ? DOKU_CLIENT_ID : 'MISSING');
console.log('🔧 DEBUG: DOKU_SECRET_KEY:', DOKU_SECRET_KEY ? DOKU_SECRET_KEY : 'MISSING');

const SUPPORTED_PAYMENT_METHODS = [
  "VIRTUAL_ACCOUNT_BCA",
  "VIRTUAL_ACCOUNT_BNI", 
  "VIRTUAL_ACCOUNT_BRI",
  "VIRTUAL_ACCOUNT_MANDIRI",
  "VIRTUAL_ACCOUNT_PERMATA"
];

// Generate digest (similar to your POC)
const generateDigest = (body) => {
  console.log('🔧 DEBUG: Generating digest for body:', body);
  
  // DOKU way: SHA256 hash then base64 (without SHA-256= prefix)
  const hash = crypto.createHash('sha256').update(body, 'utf-8').digest();
  const bufferFromHash = Buffer.from(hash);
  const digest = bufferFromHash.toString('base64');
  
  console.log('🔧 DEBUG: Generated digest (DOKU style):', digest);
  return digest;
};

// Generate signature (adapted from your POC)
const generateSignature = (clientId, requestId, requestTimestamp, requestTarget, digest, secretKey) => {
  console.log('🔧 DEBUG: === SIGNATURE GENERATION START ===');
  
  // DOKU way: Build component signature exactly as their sample
  let componentSignature = "Client-Id:" + clientId;
  componentSignature += "\n";
  componentSignature += "Request-Id:" + requestId;
  componentSignature += "\n";
  componentSignature += "Request-Timestamp:" + requestTimestamp;
  componentSignature += "\n";
  componentSignature += "Request-Target:" + requestTarget;
  
  // Add digest (without SHA-256= prefix, just the base64 value)
  if (digest) {
    componentSignature += "\n";
    componentSignature += "Digest:" + digest;
  }
  
  console.log('🔧 DEBUG: Component signature (DOKU format):');
  console.log('---START---');
  console.log(componentSignature.toString());
  console.log('---END---');
  
  // DOKU way: HMAC-SHA256 then base64
  const hmac256Value = crypto.createHmac('sha256', secretKey)
                            .update(componentSignature.toString())
                            .digest();
  
  const bufferFromHmac256Value = Buffer.from(hmac256Value);
  const signature = bufferFromHmac256Value.toString('base64');
  const fullSignature = "HMACSHA256=" + signature;
  
  console.log('🔧 DEBUG: Raw signature (base64):', signature);
  console.log('🔧 DEBUG: Full signature:', fullSignature);
  console.log('🔧 DEBUG: === SIGNATURE GENERATION END ===');
  
  return fullSignature;
};

const generateInvoiceNumber = () => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  return `INV-${timestamp}`;
};

// Create payment request (similar to send_topup_request)
const createPaymentLink = async (billingData) => {
  console.log('🚀 DEBUG: === PAYMENT LINK CREATION START ===');
  console.log('🔧 DEBUG: Input billing data:', JSON.stringify(billingData, null, 2));

  // Validation
  if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
    console.error('❌ CRITICAL: DOKU credentials missing');
    console.error('   - DOKU_CLIENT_ID present:', !!DOKU_CLIENT_ID);
    console.error('   - DOKU_SECRET_KEY present:', !!DOKU_SECRET_KEY);
    throw new Error('DOKU credentials not configured');
  }

  // Request components
  const requestId = crypto.randomUUID();
  const requestTimestamp = new Date().toISOString();
  const requestTarget = '/checkout/v1/payment';
  const invoiceNumber = billingData.invoice_number || generateInvoiceNumber();

  console.log('🔧 DEBUG: Request components:');
  console.log('   - Request ID:', requestId);
  console.log('   - Request Timestamp:', requestTimestamp);
  console.log('   - Request Target:', requestTarget);
  console.log('   - Invoice Number:', invoiceNumber);

  // Transaction data
  const transactionData = {
    order: {
      amount: parseInt(billingData.total_price),
      invoice_number: invoiceNumber,
      currency: "IDR"
    },
    payment: {
      payment_due_date: 60,
      payment_method_types: SUPPORTED_PAYMENT_METHODS
    },
    customer: {
      name: billingData.patient_name,
      email: billingData.patient_email
    }
  };

  console.log('🔧 DEBUG: Transaction data:', JSON.stringify(transactionData, null, 2));

  // Generate request body and digest (DOKU way)
  const requestBody = JSON.stringify(transactionData);
  console.log('🔧 DEBUG: Request body (exact):', requestBody);
  
  // Generate digest (base64 only, no SHA-256= prefix)
  const digest = generateDigest(requestBody);
  
  // Generate signature with correct digest format
  const signature = generateSignature(DOKU_CLIENT_ID, requestId, requestTimestamp, requestTarget, digest, DOKU_SECRET_KEY);

  // Headers
  const headers = {
    'Client-Id': DOKU_CLIENT_ID,
    'Request-Id': requestId,
    'Request-Timestamp': requestTimestamp,
    'Signature': signature,
    'Content-Type': 'application/json'
  };

  console.log('🔧 DEBUG: Final headers:');
  Object.entries(headers).forEach(([key, value]) => {
    if (key === 'Signature') {
      console.log(`   - ${key}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`   - ${key}: ${value}`);
    }
  });

  const fullUrl = `${DOKU_BASE_URL}${requestTarget}`;
  console.log('🔧 DEBUG: Full URL:', fullUrl);

  try {
    console.log('🌐 DEBUG: Making DOKU API request...');
    
    const response = await axios.post(fullUrl, transactionData, { 
      headers,
      timeout: 30000,
      validateStatus: () => true
    });

    console.log('📡 DEBUG: DOKU API Response:');
    console.log('   - Status:', response.status);
    console.log('   - Data:', JSON.stringify(response.data, null, 2));

    if (response.status >= 200 && response.status < 300) {
      console.log('✅ SUCCESS: Payment link created!');
      console.log('🔗 Payment URL:', response.data.redirect_url || response.data.payment_url);
      
      // Create transaction log
      try {
        await prisma.dokuTransactionLog.create({
          data: {
            billing_id: billingData.id,
            session_id: response.data.order?.session_id || 'unknown',
            amount: parseInt(billingData.total_price),
            payment_method: response.data.additional_info?.origin?.product || 'unknown',
            status: 'PENDING',
            doku_response: response.data
          }
        });
        console.log('✅ Transaction log created');
      } catch (logError) {
        console.error('⚠️ Transaction log failed:', logError.message);
      }

      return response.data;
    } else {
      console.error('❌ DOKU API Error:');
      console.error('   - Status:', response.status);
      console.error('   - Error:', JSON.stringify(response.data, null, 2));
      throw new Error(`DOKU API Error ${response.status}: ${response.data?.error?.message || response.statusText}`);
    }

  } catch (error) {
    console.error('💥 API Request Failed:');
    console.error('   - Error:', error.message);
    
    if (error.response) {
      console.error('   - Response Status:', error.response.status);
      console.error('   - Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    console.error('🔧 DEBUG: Request details:');
    console.error('   - URL:', fullUrl);
    console.error('   - Headers:', JSON.stringify(headers, null, 2));
    console.error('   - Body:', requestBody);
    
    throw new Error(`DOKU Payment Failed: ${error.message}`);
  } finally {
    console.log('🔚 DEBUG: === PAYMENT LINK CREATION END ===');
  }
};

// Process DOKU notification (adapted from your process_doku_notification)
const processDokuNotification = async (reqBody, headers) => {
  try {
    // Extract notification data
    const invoiceNumber = reqBody.order?.invoice_number;
    const status = reqBody.transaction?.status;
    const transactionDate = reqBody.transaction?.date;
    const amount = reqBody.order?.amount;
    const virtualAccountNumber = reqBody.virtual_account_info?.virtual_account_number;
    const paymentMethod = reqBody.channel?.id;

    if (!invoiceNumber) {
      throw new Error('Invoice number not found in notification');
    }

    // Find billing by invoice number
    const billing = await prisma.billing.findUnique({
      where: { invoice_number: invoiceNumber }
    });

    if (!billing) {
      return {
        statusCode: 404,
        message: 'Billing not found for invoice number'
      };
    }

    // Update billing status
    const billingStatus = status === 'SUCCESS' ? 'PAID' : 'FAILED';
    
    const updatedBilling = await prisma.billing.update({
      where: { id: billing.id },
      data: { 
        status: billingStatus,
        payment_method: paymentMethod,
        virtual_account_number: virtualAccountNumber,
        payment_processed_at: new Date(transactionDate)
      }
    });

    // Update DOKU transaction log (POC pattern)
    await prisma.dokuTransactionLog.updateMany({
      where: { billing_id: billing.id },
      data: {
        status: billingStatus,
        payment_method: paymentMethod
      }
    });

    return {
      statusCode: 200,
      message: 'Payment notification processed successfully',
      data: {
        billing_id: updatedBilling.id,
        status: billingStatus,
        amount: amount,
        payment_method: paymentMethod
      }
    };
  } catch (error) {
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: 'Billing not found'
      };
    }
    throw error;
  }
};

const getPaymentHistory = async (patientId) => {
  return await prisma.billing.findMany({
    where: { 
      patient_id: patientId,
      status: { in: ['PAID', 'FAILED'] }
    },
    include: {
      doku_transaction_logs: true,
      scheduling: { select: { date: true } },
      medical_record: { select: { diagnosis: true } }
    },
    orderBy: { payment_processed_at: 'desc' }
  });
};

// Get payment status
const getPaymentStatus = async (billingId) => {
  if (!billingId) {
    const error = new Error("Billing ID is required");
    error.status = 400;
    throw error;
  }

  const billing = await prisma.billing.findUnique({
    where: { id: billingId },
    include: {
      patient: {
        select: { name: true, email: true }
      }
    }
  });

  if (!billing) {
    const error = new Error("Billing not found");
    error.status = 404;
    throw error;
  }

  return billing;
};

module.exports = {
  createPaymentLink,
  processDokuNotification,
  getPaymentStatus,
  getPaymentHistory
};