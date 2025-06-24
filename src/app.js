const express = require('express');
const indexRoutes = require('./routes/index.routes');
const errorHandler = require('./middlewares/errorHandler');
const rateLimit = require('express-rate-limit');

const app = express();

const apiLimiter = rateLimit({ 
    windowMs: 60 * 1000, // Jendela waktu 1 menit 
    max: 10, // Maksimal 20 permintaan per IP dalam 15 menit 
    message: 'Terlalu banyak permintaan, coba lagi setelah 1 menit.', // Pesan jika limit terlampaui 
    standardHeaders: true, // Menambahkan header RateLimit-* ke response 
    legacyHeaders: false,  // Menonaktifkan X-RateLimit-* header 
}); 

// middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // digunakan untuk parsing application/x-www-form-urlencoded, tapi kalau cuma JSON, tidak perlu ini
app.use(apiLimiter); // menggunakan rate limiter untuk semua endpoint

// routes
// test endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: 'Welcome to the API',
    data: null
  })
});

// other routes
app.use('/api/v1', indexRoutes);

// handler if route does not exist
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error); // akan diteruskan ke middleware error handler
})

// error handler
app.use(errorHandler);

module.exports = app;