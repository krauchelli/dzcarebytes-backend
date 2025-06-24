// src/modules/patient/patient.route.js
const express = require('express');
const patientController = require('./patient.controller.js');
// const authMiddleware = require('../../middlewares/authMiddleware'); // Jika Anda akan menambahkan JWT nanti
const { authenticateToken, authorizeRoles } = require("../../middlewares/auth.middleware");

const router = express.Router();

// Rute CRUD untuk Patient
// Sesuai fitur[cite: 2]: "Patient: CRUD (pakai / tanpa JWT)"
// Untuk saat ini, kita tidak implementasi JWT dulu

router.get('/getAllPatients', authenticateToken, authorizeRoles("ADMIN"), patientController.getAllPatients);
router.post('/addPatient', authenticateToken, authorizeRoles("ADMIN"), patientController.createPatient);
router.get('/getPatient/:id', authenticateToken, authorizeRoles("ADMIN"), patientController.getPatientById);
router.put('/editPatientProfile/:id', authenticateToken, authorizeRoles("ADMIN"), patientController.updatePatient);
router.delete('/deletePatient/:id', authenticateToken, authorizeRoles("ADMIN"), patientController.deletePatient);

module.exports = router;