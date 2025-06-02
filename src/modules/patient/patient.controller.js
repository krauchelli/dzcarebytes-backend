const patientService = require('./patient.service.js');

const getAllPatients = async (req, res, next) => {
    try {
        const patients = await patientService.getAllPatients();
        res.status(200).json({
            statusCode: 200,
            message: 'Patients retrieved successfully',
            data: patients,
        });
    } catch (error) {
        next(error);
    }
};

const getPatientById = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        if (!patient) {
            const err = new Error('Patient not found');
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Patient retrieved successfully',
            data: patient,
        });
    } catch (error) {
        next(error);
    }
};

const createPatient = async (req, res, next) => {
    try {
        const patient = await patientService.createPatient(req.body); // perlu diubah untuk body yang sesuai
        
        if (!patient) {
            const err = new Error('Invalid patient data');
            err.status = 400; // Bad Request
            return next(err);
        }

        res.status(201).json({
            statusCode: 201,
            message: 'Patient created successfully',
            data: patient,
        });
    } catch (error) {
        // Jika service melempar error validasi dengan status 400, itu akan diteruskan
        next(error);
    }
};

const updatePatient = async (req, res, next) => {
    try {
        const patient = await patientService.updatePatient(req.params.id, req.body); // perlu diubah untuk body yang sesuai
        if (!patient) {
            const err = new Error('Patient not found for update');
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Patient updated successfully',
            data: patient,
        });
    } catch (error) {
        next(error);
    }
};

const deletePatient = async (req, res, next) => {
    try {
        const patient = await patientService.deletePatient(req.params.id);
        if (!patient) {
            const err = new Error('Patient not found for deletion');
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Patient deleted successfully',
            data: patient, // Mengembalikan data pasien yang dihapus
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
};