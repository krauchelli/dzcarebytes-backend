// src/modules/patient/patient.route.js
const express = require('express');
const patientController = require('./patient.controller.js');
// const authMiddleware = require('../../middlewares/authMiddleware'); // Jika Anda akan menambahkan JWT nanti

const router = express.Router();

// Rute CRUD untuk Patient
// Sesuai fitur[cite: 2]: "Patient: CRUD (pakai / tanpa JWT)"
// Untuk saat ini, kita tidak implementasi JWT dulu

router.get('/', patientController.getAllPatients);
router.post('/', patientController.createPatient);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;