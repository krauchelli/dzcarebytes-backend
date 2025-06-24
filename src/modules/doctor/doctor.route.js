const express = require("express");
const doctorController = require("./doctor.controller");
const { authenticateToken, authorizeRoles } = require("../../middlewares/auth.middleware");

const router = express.Router();

// CRUD DOCTOR
router.get("/getAllDoctors", authenticateToken, authorizeRoles("ADMIN"), doctorController.getAllDoctors);
router.get("/getDoctor/:id", authenticateToken, authorizeRoles("ADMIN"), doctorController.getDoctorById);
router.post("/addDoctor", authenticateToken, authorizeRoles("ADMIN"), doctorController.createDoctor);
router.put("/editDoctorProfile/:id", authenticateToken, authorizeRoles("ADMIN"), doctorController.updateDoctor);
router.delete("/deleteDoctor/:id", authenticateToken, authorizeRoles("ADMIN"), doctorController.deleteDoctor);

module.exports = router;