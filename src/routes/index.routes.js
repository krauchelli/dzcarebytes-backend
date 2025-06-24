// src/routes/index.routes.js
const express = require("express");
const adminRoutes = require("../modules/admin/admin.route.js");
const patientRoutes = require("../modules/patient/patient.route.js");
const doctorRoutes = require("../modules/doctor/doctor.route.js");
const schedulingRoutes = require("../modules/scheduling/scheduling.route.js");
const medicalRecordRoutes = require("../modules/medical_records/medical_record.route.js");
const authRoutes = require("../modules/authorization/auth.route.js");
const medicineRoutes = require("../modules/medicine/medicine.route.js");
// Impor rute modul lain di sini

const router = express.Router();

router.use("/admins", adminRoutes);
router.use("/patients", patientRoutes);
router.use("/scheduling", schedulingRoutes);
router.use("/medical_records", medicalRecordRoutes);
router.use("/auth", authRoutes);
router.use("/doctors", doctorRoutes);
router.use("/medicines", medicineRoutes);

// Rute default untuk /api
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to DzCareBytes API",
  });
});

module.exports = router;
