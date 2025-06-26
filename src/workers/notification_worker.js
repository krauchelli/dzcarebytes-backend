const { connect } = require('../config/rabbitmq');
const fs = require('fs').promises; 
const path = require('path');    

const logFilePath = path.join(__dirname, '../../logs/notifications.log');


async function ensureLogFileExists() {
  try {
    const logDir = path.dirname(logFilePath);
    await fs.mkdir(logDir, { recursive: true });
    await fs.access(logFilePath);
  } catch (error) {
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

    channel.consume(queueName, async (msg) => { 
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log(`[x] Pesan diterima:`, message);

        try {
          const logMessage = `${new Date().toISOString()} | ${JSON.stringify(message)}\n`;

          await fs.appendFile(logFilePath, logMessage);

          console.log(`[+] Pesan berhasil disimpan ke log.`);

        } catch (logError) {
          console.error("Gagal menulis ke file log:", logError);
        }
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