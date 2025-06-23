const { scheduling } = require("../../config/prismaClient");
const adminService = require("../admin/admin.service");

// --------------------- GET ALL USER ---------------------
const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({
      statusCode: 200,
      message: "User retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- ADMIN CRUD ---------------------
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json({
      statusCode: 200,
      message: "Admins retrieved successfully",
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    if (!admin) {
      const err = new Error("Admin not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Admin retrieved successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    if (!admin) {
      const err = new Error("Admin not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.deleteAdmin(req.params.id);
    if (!admin) {
      const err = new Error("Admin not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- PATIENT CRUD ---------------------
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await adminService.getAllPatients();
    res.status(200).json({
      statusCode: 200,
      message: "Patients retrieved successfully",
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await adminService.getPatientById(req.params.id);
    if (!patient) {
      const err = new Error("Patient not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Patient retrieved successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const createPatient = async (req, res, next) => {
  try {
    const patient = await adminService.createPatient(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const patient = await adminService.updatePatient(req.params.id, req.body);
    if (!patient) {
      const err = new Error("Patient not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const patient = await adminService.deletePatient(req.params.id);
    if (!patient) {
      const err = new Error("Patient not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- DOCTOR CRUD ---------------------
const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await adminService.getAllDoctors();
    res.status(200).json({
      statusCode: 200,
      message: "Doctors retrieved successfully",
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await adminService.getDoctorById(req.params.id);
    if (!doctor) {
      const err = new Error("Doctor not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Doctor retrieved successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const createDoctor = async (req, res, next) => {
  try {
    const doctor = await adminService.createDoctor(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await adminService.updateDoctor(req.params.id, req.body);
    if (!doctor) {
      const err = new Error("Doctor not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await adminService.deleteDoctor(req.params.id);
    if (!doctor) {
      const err = new Error("Doctor not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- SCHEDULE CRUD ---------------------
const createSchedule = async (req, res, next) => {
  try {
    const dataSchedule = await adminService.createSchedule(req.body);
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
    const dataSchedule = await adminService.getAllSchedules();
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
    const dataSchedule = await adminService.getScheduleById(req.params.id);
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
    const dataSchedule = await adminService.updateSchedule(req.params.id, req.body);
    if (!dataSchedule) {
      const err = new Error("Schedule not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Schedule updated successfully",
      data: dataSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const dataSchedule = await adminService.deleteSchedule(req.params.id);
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

// --------------------- MEDICINE CRUD ---------------------
const getAllMedicines = async (req, res, next) => {
  try {
    const medicine = await adminService.getAllMedicines();
    res.status(200).json({
      statusCode: 200,
      message: "Medicine retrieved successfully",
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicineByName = async (req, res, next) => {
  try {
    const medicine = await adminService.getMedicineByName(req.params.name);
    if (!medicine) {
      const err = new Error("Medicine not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Medicine retrieved succsessfully",
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

const addMedicine = async (req, res, next) => {
  try {
    const medicine = await adminService.addMedicine(req.body);
    console.log("Medicine added:", medicine);
    res.status(201).json({
      statusCode: 201,
      message: "Medicine added successfully",
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await addMedicine.updateMedicine(
      req.params.name,
      req.body
    );
    if (!medicine) {
      const err = new Error("Medicine not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Medicine updated succsessfully",
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await adminService.deleteMedicine(req.params.name);
    if (!medicine) {
      const err = new Error("Medicine not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    next(error);
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
