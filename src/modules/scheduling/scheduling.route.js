// src/modules/admin/admin.route.js
const express = require("express");
const schedulingController = require("./scheduling.controller");
const { authenticateToken, authorizeRoles } = require("../../middlewares/auth.middleware");

const router = express.Router();

// CRUD SCHEDULE
router.post("/createSchedule", authenticateToken, authorizeRoles("ADMIN", "DOCTOR"), schedulingController.createSchedule);
router.get("/getAllSchedules", authenticateToken, authorizeRoles("ADMIN", "DOCTOR"), schedulingController.getAllSchedules);
router.get("/getScheduleById/:id", authenticateToken, authorizeRoles("ADMIN", "DOCTOR", "PATIENT"), schedulingController.getScheduleById);
router.put("/updateSchedule/:id", authenticateToken, authorizeRoles("ADMIN", "DOCTOR"), schedulingController.updateSchedule);
router.delete("/deleteSchedule/:id", authenticateToken, authorizeRoles("ADMIN", "DOCTOR"), schedulingController.deleteSchedule);

module.exports = router;
