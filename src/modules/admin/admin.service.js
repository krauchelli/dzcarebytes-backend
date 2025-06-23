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
  const doctorId = id;

  if (!doctorId) {
    const error = new Error("Invalid doctor ID format");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.user.delete({
      where: { id: doctorId },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

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
    return prisma.scheduling.update({
      where: { id: scheduleId },
      data: dataToUpdate,
    });
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

// --------------------- MEDICINE ---------------------
const getAllMedicines = async () => {
  return prisma.pharmacy.findMany();
};

const getMedicineByName = async (name) => {
  const medicineName = name;

  if (!medicineName) {
    const error = new Error("Invalid Medicine Name");
    error.status = 400;
    throw error;
  }

  return prisma.pharmacy.findUnique({ where: { medicine_name: medicineName } });
};

const addMedicine = async (medicineData) => {
  const { medicine_name, stock, price } = medicineData;

  if (!medicine_name || !stock || !price) {
    const error = new Error(
      "Missing required fields: medicine_name, stock, price"
    );
    error.status = 400;
    throw error;
  }

  return prisma.pharmacy.create({
    data: {
      medicine_name,
      stock: parseInt(stock, 10),
      price: parseInt(price, 10),
    },
  });
};

const updateMedicine = async (name, medicineData) => {
  const medicineName = name;

  if (!medicineName) {
    const error = new Error("Invalid Medicine Name");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.pharmacy.update({
      where: { medicine_name: medicineName },
      data: {
        ...medicineData,
        ...(medicineData.stock && { stock: parseInt(medicineData.stock, 10) }),
        ...(medicineData.price && { price: parseInt(medicineData.price, 10) }),
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

const deleteMedicine = async (name) => {
  const medicineName = name;

  if (!medicineName) {
    const error = new Error("Invalid medicine name");
    error.status = 400;
    throw error;
  }

  try {
    return prisma.pharmacy.delete({
      where: { medicine_name: medicineName },
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
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getAllMedicines,
  getMedicineByName,
  addMedicine,
  updateMedicine,
  deleteMedicine,
};
