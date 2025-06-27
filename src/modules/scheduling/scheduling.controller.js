const rabbitmq = require('../../config/rabbitmq');
const schedulingService = require("../scheduling/scheduling.service");
const prisma = require('../../config/prismaClient'); // Add this import

// --------------------- SCHEDULE CRUD ---------------------
const createSchedule = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.createSchedule(req.body);
    try {
      const { channel } = await rabbitmq.connect();
      const queueName = 'notification_queue';
      const message = {
        type: 'SCHEDULE_CREATED',
        timestamp: new Date().toISOString(),
        data: dataSchedule
      };
      await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`[RabbitMQ] Pesan berhasil dikirim ke antrean '${queueName}'`);
      } catch (rabbitError) {
        console.error("Gagal mengirim pesan ke RabbitMQ, tetapi jadwal tetap berhasil dibuat.", rabbitError);
    }

    res.status(201).json({
      statusCode: 201,
      message: "Schedule created successfully",
      data: dataSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSchedules = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.getAllSchedules();
    res.status(200).json({
      statusCode: 200,
      message: "Schedules retrieved successfully",
      data: dataSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.getScheduleById(req.params.id);
    if (!dataSchedule) {
      const err = new Error("Schedule not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Schedule retrieved successfully",
      data: dataSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.updateSchedule(req.params.id, req.body);
    if (!dataSchedule) {
      const err = new Error("Schedule not found");
      err.status = 404;
      return next(err);
    }

    // 🆕 Check if billing was auto-generated for COMPLETED status
    let billingInfo = null;
    if (req.body.status === 'COMPLETED') {
      try {
        console.log('🔍 Checking for auto-generated billing...');
        
        // Wait a moment for billing to be created (async operation)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const billing = await prisma.billing.findUnique({
          where: { scheduling_id: req.params.id },
          include: {
            medical_record: {
              select: {
                id: true,
                diagnosis: true,
                medicine_name: true,
                quantity: true
              }
            }
          }
        });

        if (billing) {
          billingInfo = {
            billing_id: billing.id,
            invoice_number: billing.invoice_number,
            total_amount: billing.total_price,
            consultation_fee: billing.scheduling_price,
            medicine_fee: billing.medicine_price,
            payment_link: billing.payment_link,
            payment_status: billing.status,
            has_medical_record: !!billing.medical_record,
            medical_record: billing.medical_record
          };
          
          console.log('✅ Billing info retrieved:', {
            billing_id: billingInfo.billing_id,
            total_amount: billingInfo.total_amount,
            payment_link: billingInfo.payment_link ? 'Generated' : 'Failed'
          });
        } else {
          console.log('⚠️ No billing found for completed appointment');
        }
      } catch (billingError) {
        console.error('❌ Error retrieving billing info:', billingError.message);
      }
    }

    // RabbitMQ notification
    try {
      const { channel } = await rabbitmq.connect();
      const queueName = 'notification_queue';
      const message = {
        type: 'SCHEDULE_UPDATED',
        timestamp: new Date().toISOString(),
        data: {
          ...dataSchedule,
          billing: billingInfo // Include billing info in notification
        }
      };
      await channel.assertQueue(queueName, { durable: true });
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`[RabbitMQ] Pesan berhasil dikirim ke antrean '${queueName}'`);
    } catch (rabbitError) {
      console.error("Gagal mengirim pesan ke RabbitMQ, tetapi jadwal tetap berhasil diperbarui.", rabbitError);
    }

    // 🎯 Enhanced response with billing information
    const responseData = {
      schedule: dataSchedule
    };

    // Add billing info to response if available
    if (billingInfo) {
      responseData.billing = billingInfo;
      responseData.auto_billing_generated = true;
    }

    res.status(200).json({
      statusCode: 200,
      message: billingInfo ? 
        "Schedule updated successfully and billing generated automatically" : 
        "Schedule updated successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.deleteSchedule(req.params.id);
    if (!dataSchedule) {
      const err = new Error("Schedule not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};