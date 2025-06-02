const express = require('express');
const indexRoutes = require('./routes/index.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // digunakan untuk parsing application/x-www-form-urlencoded, tapi kalau cuma JSON, tidak perlu ini

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