const medicineService = require("../medicine/medicine.service");

// --------------------- MEDICINE CRUD ---------------------
const getAllMedicines = async (req, res, next) => {
    try {
        const medicine = await medicineService.getAllMedicines();
        res.status(200).json({
            statusCode: 200,
            message: "Medicine retrieved successfully",
            data: medicine,
        });
    } catch (error) {
        next(error);
    }
};

const getMedicineByName = async (req, res, next) => {
    try {
        const medicine = await medicineService.getMedicineByName(req.params.name);
        if (!medicine) {
            const err = new Error("Medicine not found");
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: "Medicine retrieved succsessfully",
            data: medicine,
        });
    } catch (error) {
        next(error);
    }
};

const addMedicine = async (req, res, next) => {
    try {
        const medicine = await medicineService.addMedicine(req.body);
        res.status(201).json({
            statusCode: 201,
            message: "Medicine added successfully",
            data: medicine,
        });
    } catch (error) {
        next(error);
    }
};

const updateMedicine = async (req, res, next) => {
    try {
        const medicine = await medicineService.updateMedicine(
            req.params.name,
            req.body
        );
        if (!medicine) {
            const err = new Error("Medicine not found");
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: "Medicine updated succsessfully",
            data: medicine,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMedicine = async (req, res, next) => {
    try {
        const medicine = await medicineService.deleteMedicine(req.params.name);
        if (!medicine) {
            const err = new Error("Medicine not found");
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: "Medicine deleted successfully",
            });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllMedicines,
    getMedicineByName,
    addMedicine,
    updateMedicine,
    deleteMedicine,
};