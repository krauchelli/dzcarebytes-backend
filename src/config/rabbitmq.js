const amqp = require('amqplib');

// Variabel untuk menyimpan koneksi dan channel, agar bisa digunakan kembali
let connection = null;
let channel = null;
const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

/**
 * Untuk membuat koneksi dan channel ke RabbitMQ
 * agar hanya ada satu koneksi yang digunakan oleh aplikasi
 */
const connect = async () => {
  try {
    if (connection && channel) {
      console.log('Menggunakan koneksi RabbitMQ yang sudah ada.');
      return { connection, channel };
    }

    console.log('Membuat koneksi baru ke RabbitMQ...');
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    console.log('Koneksi RabbitMQ berhasil dibuat!');

    // Menangani jika koneksi terputus
    connection.on('error', (err) => {
      console.error('Koneksi RabbitMQ error:', err);
      connection = null; // Reset koneksi
      channel = null;
      setTimeout(connect, 5000); // Coba konek lagi setelah 5 detik
    });

    connection.on('close', () => {
      console.warn('Koneksi RabbitMQ ditutup. Mencoba menghubungkan kembali...');
      connection = null;
      channel = null;
      setTimeout(connect, 5000);
    });

    return { connection, channel };

  } catch (error) {
    console.error('Gagal terhubung ke RabbitMQ:', error);
    setTimeout(connect, 5000);
    throw error;
  }
};

module.exports = { connect };