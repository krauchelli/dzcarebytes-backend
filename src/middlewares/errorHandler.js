/**
 * Global Error Handler Middleware
 * @param {Error} err - Objek error
 * @param {import('express').Request} req - Objek request Express
 * @param {import('express').Response} res - Objek response Express
 * @param {import('express').NextFunction} next - Fungsi next Express
 */

 // eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Log error ke konsol (untuk development)
    // Di produksi, Anda mungkin ingin menggunakan logger yang lebih canggih (Winston, Pino, dll.)
    console.error('-------------------- ERROR START --------------------');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('Error Message:', err.message);
    console.error('Error Status Code (from error object):', err.status);
    if (process.env.NODE_ENV === 'development') {
        console.error('Error Stack:', err.stack); // Tampilkan stack trace hanya di development
    }
    console.error('--------------------- ERROR END ---------------------');

    const httpStatusCode = err.status || 500; // Default ke 500 jika status tidak diset pada error object
    const errorMessage = err.message || 'An unexpected error occurred. Please try again later.';

    // Mengirim respons error dalam format JSON sesuai preferensi Anda
    res.status(httpStatusCode).json({
        statusCode: httpStatusCode,
        message: errorMessage,
        data: null // Sesuai preferensi, 'data' adalah null untuk respons error
    });
};

// Ekspor middleware error handler
module.exports = errorHandler;
// Catatan: Middleware ini harus diletakkan di bagian akhir, setelah semua route dan middleware lainnya.