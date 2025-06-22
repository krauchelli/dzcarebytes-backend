const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../../config/prismaClient');

// DOKU Configuration
const DOKU_BASE_URL = process.env.DOKU_BASE_URL || 'https://api-sandbox.doku.com';
const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID;
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY;

const SUPPORTED_PAYMENT_METHODS = [
  "VIRTUAL_ACCOUNT_BCA",
  "VIRTUAL_ACCOUNT_BNI", 
  "VIRTUAL_ACCOUNT_BRI",
  "VIRTUAL_ACCOUNT_MANDIRI",
  "VIRTUAL_ACCOUNT_PERMATA"
];

// Generate digest (similar to your POC)
const generateDigest = (body) => {
  const hash = crypto.createHash('sha256');
  hash.update(body, 'utf8');
  return `SHA-256=${hash.digest('base64')}`;
};

// Generate signature (adapted from your POC)
const generateSignature = (clientId, requestId, requestTimestamp, requestTarget, digest, secretKey) => {
  const componentSignature = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(componentSignature);
  return `HMACSHA256=${hmac.digest('base64')}`;
};

// Create payment request (similar to send_topup_request)
const createPaymentLink = async (billingData) => {
  if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
    throw new Error('DOKU credentials not configured');
  }

  const requestId = crypto.randomUUID();
  const requestTimestamp = new Date().toISOString();
  const requestTarget = '/checkout/v1/payment';

  const transactionData = {
    order: {
      amount: parseInt(billingData.total_price),
      invoice_number: billingData.id,
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

  const body = JSON.stringify(transactionData);
  const digest = generateDigest(body);
  const signature = generateSignature(DOKU_CLIENT_ID, requestId, requestTimestamp, requestTarget, digest, DOKU_SECRET_KEY);

  const headers = {
    'Client-Id': DOKU_CLIENT_ID,
    'Request-Id': requestId,
    'Request-Timestamp': requestTimestamp,
    'Request-Target': requestTarget,
    'Digest': digest,
    'Signature': signature,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(`${DOKU_BASE_URL}${requestTarget}`, transactionData, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`DOKU API Error: ${error.response?.data?.message || error.message}`);
  }
};

// Process DOKU notification (adapted from your process_doku_notification)
const processDokuNotification = async (reqBody, headers) => {
  try {
    const clientId = headers['client-id'];
    const requestId = headers['request-id'];
    const requestTimestamp = headers['request-timestamp'];
    const signature = headers['signature'];
    const requestTarget = '/doku/payment-notification';

    // Extract notification data
    const invoiceNumber = reqBody.order?.invoice_number;
    const status = reqBody.transaction?.status;
    const transactionDate = reqBody.transaction?.date;
    const amount = reqBody.order?.amount;
    const virtualAccountNumber = reqBody.virtual_account_info?.virtual_account_number;

    if (!invoiceNumber) {
      throw new Error('Invoice number not found in notification');
    }

    // Update billing status in database
    const billingStatus = status === 'SUCCESS' ? 'PAID' : 'FAILED';
    
    const updatedBilling = await prisma.billing.update({
      where: { id: invoiceNumber },
      data: { 
        status: billingStatus,
        payment_processed_at: new Date(transactionDate)
      }
    });

    return {
      statusCode: 200,
      message: 'Payment notification processed successfully',
      data: {
        billing_id: updatedBilling.id,
        status: billingStatus,
        amount: amount
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
  getPaymentStatus
};