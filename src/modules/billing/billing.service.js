const prisma = require('../../config/prismaClient');
const paymentService = require('../payment/payment.service');

// Generate billing when scheduling is completed
const generateBillingFromCompletedScheduling = async (schedulingId) => {
  // 1. Validate scheduling is COMPLETED
  const scheduling = await prisma.scheduling.findUnique({
    where: { id: schedulingId },
    include: {
      patient: true,
      doctor: true
    }
  });

  if (!scheduling) {
    const error = new Error("Scheduling not found");
    error.status = 404;
    throw error;
  }

  if (scheduling.status !== 'COMPLETED') {
    const error = new Error("Billing can only be generated for completed appointments");
    error.status = 400;
    throw error;
  }

  // 2. Check if billing already exists for this scheduling
  const existingBilling = await prisma.billing.findUnique({
    where: { scheduling_id: schedulingId }
  });

  if (existingBilling) {
    const error = new Error("Billing already exists for this appointment");
    error.status = 400;
    throw error;
  }

  // 3. Look for medical record with same patient, doctor, and recent date
  const medicalRecord = await prisma.medical_Record.findFirst({
    where: {
      patient_id: scheduling.patient_id,
      doctor_id: scheduling.doctor_id,
      // Find medical record created on the same day as appointment
      createdAt: {
        gte: new Date(scheduling.date.getFullYear(), scheduling.date.getMonth(), scheduling.date.getDate()),
        lt: new Date(scheduling.date.getFullYear(), scheduling.date.getMonth(), scheduling.date.getDate() + 1)
      }
    },
    include: {
      medicines: true
    },
    orderBy: { createdAt: 'desc' },
    take: 1
  });

  // 4. Calculate pricing
  const consultationFee = parseFloat(scheduling.price);
  let medicineFee = 0;
  
  if (medicalRecord) {
    // Calculate medicine cost: pharmacy.price * quantity
    medicineFee = parseFloat(medicalRecord.medicines.price) * medicalRecord.quantity;
  }

  const totalAmount = consultationFee + medicineFee;

  // 5. Generate invoice number
  const invoiceNumber = `INV-${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '')}`;

  // 6. Create billing
  const billing = await prisma.billing.create({
    data: {
      patient_id: scheduling.patient_id,
      scheduling_id: schedulingId,
      medical_record_id: medicalRecord?.id || null, // null if no medical record
      scheduling_price: consultationFee,
      medicine_price: medicineFee,
      total_price: totalAmount,
      invoice_number: invoiceNumber,
      status: 'PENDING'
    }
  });

  // 7. Generate payment link automatically
  try {
  const billingWithPatientData = {
    id: billing.id,
    total_price: billing.total_price,
    invoice_number: invoiceNumber,
    patient_name: scheduling.patient.name,
    patient_email: scheduling.patient.email
  };

  console.log('🔗 Attempting to generate payment link...');
  const paymentResponse = await paymentService.createPaymentLink(billingWithPatientData);
  
  console.log('✅ Payment link generated successfully:', paymentResponse.redirect_url);
  
  // Update billing with payment link
  const updatedBilling = await prisma.billing.update({
    where: { id: billing.id },
    data: { payment_link: paymentResponse.redirect_url }
  });

  return {
    billing: updatedBilling,
    scheduling: scheduling,
    medical_record: medicalRecord,
    payment_link: paymentResponse.redirect_url,
    breakdown: {
      consultation_fee: consultationFee,
      medicine_fee: medicineFee,
      total_amount: totalAmount,
      has_medicine: !!medicalRecord
    }
  };
} catch (error) {
  console.error('❌ Payment link generation failed:');
  console.error('   - Error:', error.message);
  console.error('   - Stack:', error.stack);
  
  // Payment link generation failed, but billing is created
  return {
    billing,
    scheduling,
    medical_record: medicalRecord,
    payment_link: null,
    error: `Payment link generation failed: ${error.message}`,
    breakdown: {
      consultation_fee: consultationFee,
      medicine_fee: medicineFee,
      total_amount: totalAmount,
      has_medicine: !!medicalRecord
    }
  };
}
};

module.exports = {
  generateBillingFromCompletedScheduling
};