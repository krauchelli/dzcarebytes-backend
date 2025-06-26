// Impor modul bawaan Node.js
const { connect } = require('../config/rabbitmq');
const fs = require('fs').promises; // Menggunakan versi promise dari modul File System
const path = require('path');     // Modul untuk menangani path file secara konsisten

const logFilePath = path.join(__dirname, '../../logs/notifications.log');


async function ensureLogFileExists() {
  try {
    // Cek apakah direktori 'logs' ada, jika tidak, buat direktori tersebut
    const logDir = path.dirname(logFilePath);
    await fs.mkdir(logDir, { recursive: true });
    // Cek apakah file ada, jika tidak, buat file kosong
    await fs.access(logFilePath);
  } catch (error) {
    // Jika file tidak ada, fs.access akan error, lalu kita buat filenya
    if (error.code === 'ENOENT') {
      await fs.writeFile(logFilePath, '');
      console.log(`File log dibuat di: ${logFilePath}`);
    } else {
      throw error; // Lemparkan error lain jika ada
    }
  }
}


async function startWorker() {
  try {
    await ensureLogFileExists(); // Pastikan file dan folder log sudah ada sebelum mulai
    const { channel } = await connect();
    const queueName = 'notification_queue';

    await channel.assertQueue(queueName, { durable: true });
    console.log(`[*] Menunggu pesan di antrean '${queueName}'. Log akan disimpan di logs/notifications.log`);

    // Mulai mengonsumsi pesan dari antrean
    channel.consume(queueName, async (msg) => { // Callback dijadikan 'async'
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log(`[x] Pesan diterima:`, message);

        // --- MULAI LOGIKA MENULIS KE FILE LOG ---
        try {
          // 1. Format pesan log agar lebih rapi (Timestamp + data JSON)
          const logMessage = `${new Date().toISOString()} | ${JSON.stringify(message)}\n`;

          // 2. Tambahkan pesan ke file log (append)
          await fs.appendFile(logFilePath, logMessage);

          console.log(`[+] Pesan berhasil disimpan ke log.`);

        } catch (logError) {
          console.error("Gagal menulis ke file log:", logError);
          // Meskipun gagal menulis log, kita tetap anggap pesan terproses
          // agar tidak terjadi loop tanpa henti jika ada masalah I/O.
        }
        // --- SELESAI LOGIKA MENULIS KE FILE LOG ---

        // Konfirmasi ke RabbitMQ bahwa pesan telah berhasil diproses
        channel.ack(msg);
      }
    }, {
      noAck: false
    });

  } catch (error) {
    console.error("Gagal menjalankan worker:", error);
  }
}

startWorker();