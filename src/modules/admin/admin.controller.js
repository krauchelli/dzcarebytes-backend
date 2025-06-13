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
