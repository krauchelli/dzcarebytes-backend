// src/modules/admin/admin.route.js
const express = require("express");
const medicalRecordController = require("./medical_record.controller");
const { authenticateToken, authorizeRoles } = require("../../middlewares/auth.middleware");

const router = express.Router();

// CRUD MEDICAL RECORDS
router.get("/getAllMedicalRecords", authenticateToken, authorizeRoles("ADMIN", "DOCTOR"), medicalRecordController.getAllMedicalRecords);
router.post("/addMedicalRecord", authenticateToken, authorizeRoles("ADMIN", "DOCTOR"), medicalRecordController.createMedicalRecord);
router.get("/getMedicalRecord/:id", authenticateToken, authorizeRoles("ADMIN", "DOCTOR", "PATIENT"), medicalRecordController.getMedicalRecordById);
router.put("/editMedicalRecord/:id", authenticateToken, authorizeRoles("ADMIN", "DOCTOR"), medicalRecordController.updateMedicalRecord);

module.exports = router;
