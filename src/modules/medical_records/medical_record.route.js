// src/modules/admin/admin.route.js
const express = require("express");
const medicalRecordController = require("./medical_record.controller");

const router = express.Router();

// CRUD MEDICAL RECORDS
router.get("/getAllMedicalRecords", medicalRecordController.getAllMedicalRecords);
router.post("/addMedicalRecord", medicalRecordController.createMedicalRecord);
router.get("/getMedicalRecord/:id", medicalRecordController.getMedicalRecordById);
router.put("/editMedicalRecord/:id", medicalRecordController.updateMedicalRecord);

module.exports = router;
