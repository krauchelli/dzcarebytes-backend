// src/routes/index.routes.js
const express = require('express');
const adminRoutes = require('../modules/admin/admin.route.js');
const patientRoutes = require('../modules/patient/patient.route.js');
const doctorRoutes = require('../modules/doctor/doctor.route.js')
// Impor rute modul lain di sini

const router = express.Router();

router.use('/admin', adminRoutes)
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes); 

// Rute default untuk /api
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to DzCareBytes API',
    });
});

module.exports = router;