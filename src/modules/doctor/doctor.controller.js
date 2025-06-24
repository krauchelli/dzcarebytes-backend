const doctorService = require('./doctor.service.js');

// --------------------- DOCTOR CRUD ---------------------
const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await doctorService.getAllDoctors();
        res.status(200).json({
            statusCode: 200,
            message: "Doctors retrieved successfully",
            data: doctors,
        });
    } catch (error) {
        next(error);
    }
};

const getDoctorById = async (req, res, next) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
        if (!doctor) {
            const err = new Error("Doctor not found");
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: "Doctor retrieved successfully",
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

const createDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.createDoctor(req.body);
        res.status(201).json({
            statusCode: 201,
            message: "Doctor created successfully",
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

const updateDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.updateDoctor(req.params.id, req.body);
        if (!doctor) {
            const err = new Error("Doctor not found");
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: "Doctor updated successfully",
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

const deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.deleteDoctor(req.params.id);
        if (!doctor) {
            const err = new Error("Doctor not found");
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: "Doctor deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
};