// src/modules/admin/admin.route.js
const express = require("express");
const medicineController = require("./medicine.controller");
const { authenticateToken, authorizeRoles } = require("../../middlewares/auth.middleware");

const router = express.Router();

// CRUD MEDICINE
router.get("/getAllMedicines", authenticateToken, authorizeRoles("ADMIN"), medicineController.getAllMedicines);
router.get("/getMedicine/:name", authenticateToken, authorizeRoles("ADMIN"), medicineController.getMedicineByName);
router.post("/addMedicine", authenticateToken, authorizeRoles("ADMIN"), medicineController.addMedicine);
router.put("/editMedicine/:name", authenticateToken, authorizeRoles("ADMIN"), medicineController.updateMedicine);
router.delete("/deleteMedicine/:name", authenticateToken, authorizeRoles("ADMIN"), medicineController.deleteMedicine);

module.exports = router;