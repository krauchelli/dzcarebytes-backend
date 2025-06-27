const patientService = require("./patient.service.js");

const getAllPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).json({
      statusCode: 200,
      message: "Patients retrieved successfully",
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
      const err = new Error("Patient not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Patient retrieved successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const createPatient = async (req, res, next) => {
  try {
    console.log('🔧 DEBUG: Request body received:', req.body);
    
    const { email, password, name, age, gender } = req.body;

    // Enhanced validation to match service requirements
    if (!email || !password || !name || !age || !gender) {
      console.error('❌ Validation failed - missing fields:', {
        email: !!email,
        password: !!password,
        name: !!name,
        age: !!age,
        gender: !!gender
      });
      
      const err = new Error("Missing required fields: email, password, name, age, gender");
      err.status = 400;
      return next(err);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const err = new Error("Invalid email format");
      err.status = 400;
      return next(err);
    }

    // Validate age (allow both string and number)
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      const err = new Error("Age must be a valid number between 1 and 150");
      err.status = 400;
      return next(err);
    }

    // Validate gender
    if (!['MALE', 'FEMALE'].includes(gender.toUpperCase())) {
      const err = new Error("Gender must be either 'MALE' or 'FEMALE'");
      err.status = 400;
      return next(err);
    }

    // Validate password length
    if (password.length < 6) {
      const err = new Error("Password must be at least 6 characters long");
      err.status = 400;
      return next(err);
    }

    console.log('✅ Validation passed, creating patient...');

    const patient = await patientService.createPatient({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      age: ageNum,
      gender: gender.toUpperCase()
    });

    console.log('✅ Patient created successfully:', patient.id);

    res.status(201).json({
      statusCode: 201,
      message: "Patient created successfully",
      data: {
        id: patient.id,
        role: patient.role,
        email: patient.email,
        name: patient.name,
        age: patient.age,
        gender: patient.gender
        // Don't return password hash
      }
    });
  } catch (error) {
    console.error('❌ Error creating patient:', error.message);
    
    // Handle duplicate email error
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      const err = new Error("Email already exists");
      err.status = 400;
      return next(err);
    }
    
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body); // perlu diubah untuk body yang sesuai
    if (!patient) {
      const err = new Error("Patient not found for update");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Patient updated successfully",
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
      const err = new Error("Patient not found for deletion");
      err.status = 404;
      return next(err);
    }
    res.status(200).json({
      statusCode: 200,
      message: "Patient deleted successfully",
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
