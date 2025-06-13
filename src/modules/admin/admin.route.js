// src/modules/admin/admin.route.js
const express = require("express");
const adminController = require("./admin.controller");

const router = express.Router();

// GET ALL USERS
router.get("/getAllUsers", adminController.getAllUsers);

// CRUD ADMIN
router.get("/getAllAdmins", adminController.getAllAdmins);
router.get("/getAdmin/:id", adminController.getAdminById);
router.post("/addAdmin", adminController.createAdmin);
router.put("/editAdminProfile/:id", adminController.updateAdmin);
router.delete("/deleteAdmin/:id", adminController.deleteAdmin);

// CRUD PATIENT
router.get("/getAllPatients", adminController.getAllPatients);
router.get("/getPatient/:id", adminController.getPatientById);
router.post("/addPatient", adminController.createPatient);
router.put("/editPatientProfile/:id", adminController.updatePatient);
router.delete("/deletePatient/:id", adminController.deletePatient);

// CRUD DOCTOR
router.get("/getAllDoctor", adminController.getAllDoctors);
router.get("/getDoctor/:id", adminController.getDoctorById);
router.post("/addDoctor", adminController.createDoctor);
router.put("/editDoctorProfile/:id", adminController.updateDoctor);
router.delete("/deleteDoctor/:id", adminController.deleteDoctor);

module.exports = router;