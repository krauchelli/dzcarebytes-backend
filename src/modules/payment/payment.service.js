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

const generateInvoiceNumber = () => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  return `INV-${timestamp}`;
};

// Create payment request (similar to send_topup_request)
const createPaymentLink = async (billingData) => {
  if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
    throw new Error('DOKU credentials not configured');
  }

  const requestId = crypto.randomUUID();
  const requestTimestamp = new Date().toISOString();
  const requestTarget = '/checkout/v1/payment';
  
  // Generate invoice number if not exists
  const invoiceNumber = billingData.invoice_number || generateInvoiceNumber();

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
    
    // Update billing with DOKU data
    const updatedBilling = await prisma.billing.update({
      where: { id: billingData.id },
      data: {
        invoice_number: invoiceNumber,
        payment_link: response.data.redirect_url || response.data.payment_url,
        session_id: response.data.order?.session_id
      }
    });

    // Create DOKU transaction log (POC pattern)
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

    return response.data;
  } catch (error) {
    throw new Error(`DOKU API Error: ${error.response?.data?.message || error.message}`);
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