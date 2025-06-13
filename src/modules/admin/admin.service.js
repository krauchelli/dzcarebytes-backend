const prisma = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");
const { generateIdWithPrefix } = require("../../helper/idHelper");
/**
 * Get all users from database.
 * @returns {Promise<Array>} Array of users
 */

const getAllUsers = async () => {
  return prisma.User.findMany();
};

// --------------------- ADMIN ---------------------
const getAllAdmins = async () => {
  return prisma.user.findMany({ where: { role: "ADMIN" } });
};

const getAdminById = async (id) => {
  const adminId = id;

  if (!adminId) {
    const error = new Error("Invalid admin ID format");
    error.status = 400;
    throw error;
  }

  return prisma.user.findUnique({ where: { id: adminId } });
};

const createAdmin = async (adminData) => {
  const id = generateIdWithPrefix("A");

  const { email, password, name, age, gender } = adminData;

  if (!email || !password || !name || !age || !gender) {
    const error = new Error(
      "Missing required fields: email, password, name, age, gender"
    );
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      id,
      role: "ADMIN",
      email,
      password: hashedPassword,
      name,
      age: parseInt(age, 10),
      gender,
    },
  });
};

const updateAdmin = async (id, adminData) => {
  const adminId = id;

  if (!adminId) {
    const error = new Error("Invalid admin ID format");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.user.update({
      where: { id: adminId },
      data: {
        ...adminData,
        ...(adminData.age && { age: parseInt(adminData.age, 10) }),
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

const deleteAdmin = async (id) => {
  const adminId = id;

  if (!adminId) {
    const error = new Error("Invalid admin ID format");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.user.delete({
      where: { id: adminId },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

// --------------------- PATIENT ---------------------
const getAllPatients = async () => {
  return prisma.user.findMany({ where: { role: "PATIENT" } });
};

const getPatientById = async (id) => {
  const patientId = id;

  if (!patientId) {
    const error = new Error("Invalid patient ID format");
    error.status = 400;
    throw error;
  }

  return prisma.user.findUnique({ where: { id: patientId } });
};

const createPatient = async (patientData) => {
  const id = generateIdWithPrefix("P");

  const { email, password, name, age, gender } = patientData;

  if (!email || !password || !name || !age || !gender) {
    const error = new Error(
      "Missing required fields: email, password, name, age, gender"
    );
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      id,
      role: "PATIENT",
      email,
      password: hashedPassword,
      name,
      age: parseInt(age, 10),
      gender,
    },
  });
};

const updatePatient = async (id, patientData) => {
  const patientId = id;

  if (!patientId) {
    const error = new Error("Invalid admin ID format");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.user.update({
      where: { id: patientId },
      data: {
        ...patientData,
        ...(patientData.age && { age: parseInt(patientData.age, 10) }),
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

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

// --------------------- DOCTOR ---------------------
const getAllDoctors = async () => {
  return prisma.user.findMany({ where: { role: "DOCTOR" } });
};

const getDoctorById = async (id) => {
  const doctorId = id;

  if (!doctorId) {
    const error = new Error("Invalid doctor ID format");
    error.status = 400;
    throw error;
  }

  return prisma.user.findUnique({ where: { id: doctorId } });
};

const createDoctor = async (doctorData) => {
  const id = generateIdWithPrefix("D");

  const { email, password, name, age, gender } = doctorData;

  if (!email || !password || !name || !age || !gender) {
    const error = new Error(
      "Missing required fields: email, password, name, age, gender"
    );
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      id,
      role: "DOCTOR",
      email,
      password: hashedPassword,
      name,
      age: parseInt(age, 10),
      gender,
    },
  });
};

const updateDoctor = async (id, doctorData) => {
  const doctorId = id;

  if (!doctorId) {
    const error = new Error("Invalid admin ID format");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.user.update({
      where: { id: doctorId },
      data: {
        ...doctorData,
        ...(doctorData.age && { age: parseInt(doctorData.age, 10) }),
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

const deleteDoctor = async (id) => {
  const adminId = id;

  if (adminId) {
    const error = new Error("Invalid doctor ID format");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.user.delete({
      where: { id: adminId },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
