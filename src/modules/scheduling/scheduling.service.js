const prisma = require("../../config/prismaClient");
const { generateIdWithPrefix } = require("../../helper/idHelper");
const billingService = require('../billing/billing.service');

// --------------------- SCHEDULE ---------------------
const createSchedule = async (scheduleData) => {
  const id = generateIdWithPrefix("S");

  const { patientId, doctorId, date, status, price } = scheduleData;

  if (!patientId || !doctorId || !date || !status || price === undefined || price === null) {
    const error = new Error("Missing required fields: patientId, doctorId, date, status, price");
    error.status = 400;
    throw error;
  }

  const [doctor, patient] = await Promise.all([
    prisma.user.findUnique({ where: { id: doctorId } }),
    prisma.user.findUnique({ where: { id: patientId } }),
  ]);

  if (!doctor || doctor.role !== "DOCTOR") {
    const error = new Error("Doctor not found or invalid role");
    error.status = 404;
    throw error;
  }

  if (!patient || patient.role !== "PATIENT") {
    const error = new Error("Patient not found or invalid role");
    error.status = 404;
    throw error;
  }

  return prisma.scheduling.create({
    data: {
      id,
      doctor_id: doctorId,
      patient_id: patientId,
      date,
      status,
      price: parseFloat(price),
    },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const getAllSchedules = async () => {
  return prisma.scheduling.findMany();
};

const getScheduleById = async (id) => {
  const scheduleId = id;

  if (!scheduleId) {
    const error = new Error("Invalid schedule ID format");
    error.status = 400;
    throw error;
  }

  return prisma.scheduling.findUnique({ where: { id: scheduleId } });
}

const updateSchedule = async (id, scheduleData) => {
  const scheduleId = id;

  const { patientId, doctorId, date, status, price } = scheduleData;

  const dataToUpdate = {};
  if (patientId) dataToUpdate.patient_id = patientId;
  if (doctorId) dataToUpdate.doctor_id = doctorId;
  if (date) dataToUpdate.date = date;
  if (status) dataToUpdate.status = status;
  if (price !== undefined) dataToUpdate.price = parseFloat(price);

  if (!scheduleId) {
    const error = new Error("Invalid ID");
    error.status = 400;
    throw error;
  }

  try {
    
    const updatedSchedule = await prisma.scheduling.update({
      where: { id: scheduleId },
      data: dataToUpdate,
      include: {
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    });

    // 🆕 AUTO-GENERATE BILLING when status becomes COMPLETED
    if (status === 'COMPLETED') {
      try {
        console.log(`🔔 Appointment completed, generating billing for scheduling: ${scheduleId}`);
        await billingService.generateBillingFromCompletedScheduling(scheduleId);
        console.log(`✅ Billing generated automatically for scheduling: ${scheduleId}`);
      } catch (billingError) {
        console.error(`❌ Auto-billing failed for scheduling ${scheduleId}:`, billingError.message);
        // Don't fail the scheduling update if billing fails
      }
    }

    return updatedSchedule;
  
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

const deleteSchedule = async (id) => {
  const scheduleId = id;

  if (!scheduleId) {
    const error = new Error("Invalid Id");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.scheduling.delete({
      where: { id: scheduleId },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
