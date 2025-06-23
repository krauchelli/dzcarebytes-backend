const schedulingService = require("../scheduling/scheduling.service");

// --------------------- SCHEDULE CRUD ---------------------
const createSchedule = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.createSchedule(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Schedule created successfully",
      data: dataSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSchedules = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.getAllSchedules();
    res.status(200).json({
      statusCode: 200,
      message: "Schedules retrieved successfully",
      data: dataSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.getScheduleById(req.params.id);
    if (!dataSchedule) {
      const err = new Error("Schedule not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Schedule retrieved successfully",
      data: dataSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.updateSchedule(req.params.id, req.body);
    if (!dataSchedule) {
      const err = new Error("Schedule not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Schedule updated successfully",
      data: dataSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const dataSchedule = await schedulingService.deleteSchedule(req.params.id);
    if (!dataSchedule) {
      const err = new Error("Schedule not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
