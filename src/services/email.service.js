const nodemailer = require('nodemailer');

// Konfigurasi transporter untuk membaca dari file .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"DZCAREBYTES" <${process.env.GMAIL_USER}>`, // Nama dan alamat email pengirim
      to,
      subject,
      html,
    });
    console.log(`[Email Service] Email terkirim ke ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email Service] Gagal mengirim email ke ${to}:`, error);
  }
};

module.exports = {
  sendEmail,
};