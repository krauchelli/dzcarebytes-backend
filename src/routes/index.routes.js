// src/routes/index.routes.js
const express = require('express');
const patientRoutes = require('../modules/patient/patient.route.js');
// Impor rute modul lain di sini

const router = express.Router();

router.use('/patients', patientRoutes);
// router.use('/doctors', doctorRoutes); // Contoh untuk modul lain

// Rute default untuk /api
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to DzCareBytes API',
    });
});

module.exports = router;