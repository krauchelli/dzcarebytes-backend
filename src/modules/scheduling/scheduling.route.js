// src/modules/admin/admin.route.js
const express = require("express");
const schedulingController = require("./scheduling.controller");

const router = express.Router();

// CRUD SCHEDULE
router.post("/createSchedule", schedulingController.createSchedule);
router.get("/getAllSchedules", schedulingController.getAllSchedules);
router.get("/getScheduleById/:id", schedulingController.getScheduleById);
router.put("/updateSchedule/:id", schedulingController.updateSchedule);
router.delete("/deleteSchedule/:id", schedulingController.deleteSchedule);

module.exports = router;
