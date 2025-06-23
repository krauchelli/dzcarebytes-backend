const prisma = require("../../config/prismaClient");
const { generateIdWithPrefix } = require("../../helper/idHelper");

// --------------------- MEDICAL RECORD ---------------------
const getAllMedicalRecords = async () => {
  return prisma.Medical_Record.findMany();
};

const createMedicalRecord = async (medicalRecordData) => {
  const id = generateIdWithPrefix("MR");

  const { patientId, doctorId, diagnosis, medicine_name, quantity } = medicalRecordData;

  if (!patientId || !doctorId || !diagnosis || !medicine_name || quantity === undefined || quantity === null) {
    const error = new Error("Missing required fields: patientId, doctorId, diagnosis, medicine_name, quantity");
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

  return prisma.medical_Record.create({
    data: {
      id,
      doctor_id: doctorId,
      patient_id: patientId,
      diagnosis,
      medicine_name,
      quantity: parseInt(quantity),
    },
  });
};

const getMedicalRecordById = async (id) => {
  const medicalRecordId = id;

  if (!medicalRecordId) {
    const error = new Error("Invalid schedule ID format");
    error.status = 400;
    throw error;
  }

  return prisma.Medical_Record.findUnique({ where: { id: medicalRecordId } });
}

const updateMedicalRecord = async (id, medicalRecordData) => {
  const medicalRecordId = id;

  const { patientId, doctorId, diagnosis, medicine_name, quantity } = medicalRecordData;

  const dataToUpdate = {};
  if (patientId) dataToUpdate.patient_id = patientId;
  if (doctorId) dataToUpdate.doctor_id = doctorId;
  if (diagnosis) dataToUpdate.diagnosis = diagnosis;
  if (medicine_name) dataToUpdate.medicine_name = medicine_name;
  if (quantity !== undefined) dataToUpdate.quantity = parseInt(quantity);;

  if (!medicalRecordId) {
    const error = new Error("Invalid ID");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.medical_Record.update({
      where: { id: medicalRecordId },
      data: dataToUpdate,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

module.exports = {
  getAllMedicalRecords,
  createMedicalRecord,
  getMedicalRecordById,
  updateMedicalRecord,
};
