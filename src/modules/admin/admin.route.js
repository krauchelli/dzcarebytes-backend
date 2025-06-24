// src/modules/admin/admin.route.js
const express = require("express");
const adminController = require("./admin.controller");
const { authenticateToken, authorizeRoles } = require("../../middlewares/auth.middleware");

const router = express.Router();

// GET ALL USERS
router.get("/getAllUsers", authenticateToken, authorizeRoles("ADMIN"), adminController.getAllUsers);

// CRUD ADMIN
router.get("/getAllAdmins", authenticateToken, authorizeRoles("ADMIN"), adminController.getAllAdmins);
router.get("/getAdmin/:id", authenticateToken, authorizeRoles("ADMIN"), adminController.getAdminById);
router.post("/addAdmin", authenticateToken, authorizeRoles("ADMIN"), adminController.createAdmin);
router.put("/editAdminProfile/:id", authenticateToken, authorizeRoles("ADMIN"), adminController.updateAdmin);
router.delete("/deleteAdmin/:id", authenticateToken, authorizeRoles("ADMIN"), adminController.deleteAdmin);

module.exports = router;
