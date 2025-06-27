const prisma = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");
const { generateIdWithPrefix } = require("../../helper/idHelper");

/**
 * Get all patients from database.
 * @returns {Promise<Array>} Array of patients
 */
const getAllPatients = async () => {
  return prisma.user.findMany();
};

/**
 * Get a single patient by their ID.
 * @param {number} id - The ID of the patient.
 * @returns {Promise<Object|null>} The patient object or null if not found.
 */
const getPatientById = async (id) => {
  const patientId = id;
  if (!patientId) {
    const error = new Error("Invalid patient ID format");
    error.status = 400; // Bad Request
    throw error;
  }
  return prisma.user.findUnique({
    where: { id: patientId },
    include: {
      schedulingAsPatient: true,
      medicalRecordsAsPatient: true,
    },
  });
};

/**
 * Create a new patient.
 * @param {Object} patientData - The data for the new patient.
 * @returns {Promise<Object>} The created patient object.
 */
const createPatient = async (patientData) => {
  console.log('📝 Creating patient with data:', { 
    ...patientData, 
    password: '[HIDDEN]' 
  });

  const id = generateIdWithPrefix("P");
  const { email, password, name, age, gender } = patientData;

  // Service-level validation (double-check)
  if (!email || !password || !name || !age || !gender) {
    const error = new Error(
      "Missing required fields: email, password, name, age, gender"
    );
    error.status = 400;
    throw error;
  }

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      const error = new Error("Email already exists");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = await prisma.user.create({
      data: {
        id,
        role: "PATIENT",
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        age: parseInt(age, 10),
        gender: gender.toUpperCase(),
      },
    });

    console.log('✅ Patient created successfully in database:', newPatient.id);
    return newPatient;

  } catch (error) {
    console.error('❌ Database error creating patient:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const duplicateError = new Error("Email already exists");
      duplicateError.status = 400;
      throw duplicateError;
    }
    
    throw error;
  }
};

/**
 * Update an existing patient by their ID.
 * @param {number} id - The ID of the patient to update.
 * @param {Object} patientData - The data to update the patient with.
 * @returns {Promise<Object|null>} The updated patient object or null if not found.
 */
const updatePatient = async (id, patientData) => {
  const patientId = parseInt(id, 10);
  if (isNaN(patientId)) {
    const error = new Error("Invalid patient ID format");
    error.status = 400; // Bad Request
    throw error;
  }
  try {
    return prisma.patient.update({
      where: { id: patientId },
      data: {
        ...patientData,
        // Jika ada field yang perlu konversi tipe, lakukan di sini
        ...(patientData.age && { age: parseInt(patientData.age, 10) }),
      },
    });
  } catch (error) {
    // Tangani error spesifik Prisma, misalnya P2025 (Record to update not found)
    if (error.code === "P2025") {
      return null; // Kembalikan null jika record tidak ditemukan untuk diupdate
    }
    throw error; // Lempar ulang error lain
  }
};

/**
 * Delete a patient by their ID.
 * @param {number} id - The ID of the patient to delete.
 * @returns {Promise<Object|null>} The deleted patient object or null if not found.
 */
const deletePatient = async (id) => {
  const patientId = id;

  if (!patientId) {
    const error = new Error("Invalid patient ID format");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.user.delete({
      where: { id: patientId },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
