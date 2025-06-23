const medicalRecordService = require("../medical_records/medical_record.service");

// --------------------- MEDICAL RECORD ---------------------
const getAllMedicalRecords = async (req, res, next) => {
  try {
    const medicine = await medicalRecordService.getAllMedicalRecords();
    res.status(200).json({
      statusCode: 200,
      message: "Medical Records retrieved successfully",
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

const createMedicalRecord = async (req, res, next) => {
  try {
    const medicalRecordData = req.body;
    const newMedicalRecord = await medicalRecordService.createMedicalRecord(medicalRecordData);
    res.status(201).json({
      statusCode: 201,
      message: "Medical Record created successfully",
      data: newMedicalRecord,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicalRecordById = async (req, res, next) => {
  try {
    const medicalRecord = await medicalRecordService.getMedicalRecordById(req.params.id);
    if (!medicalRecord) {
      return res.status(404).json({
        statusCode: 404,
        message: "Medical Record not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "Medical Record retrieved successfully",
      data: medicalRecord,
    });
  } catch (error) {
    next(error);
  }
};

const updateMedicalRecord = async (req, res, next) => {
  try {
    const dataMedicalRecord = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);
    if (!dataMedicalRecord) {
      const err = new Error("Medical Record not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Medical Record updated successfully",
      data: dataMedicalRecord,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMedicalRecords,
  createMedicalRecord,
  getMedicalRecordById,
  updateMedicalRecord,
};
