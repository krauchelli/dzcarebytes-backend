const adminService = require("../admin/admin.service");

// --------------------- GET ALL USER ---------------------
const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({
      statusCode: 200,
      message: "User retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- ADMIN CRUD ---------------------
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json({
      statusCode: 200,
      message: "Admins retrieved successfully",
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    if (!admin) {
      const err = new Error("Admin not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Admin retrieved successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    if (!admin) {
      const err = new Error("Admin not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.deleteAdmin(req.params.id);
    if (!admin) {
      const err = new Error("Admin not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
