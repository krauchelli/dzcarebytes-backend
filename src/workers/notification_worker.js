require('dotenv').config();
const { connect } = require('../config/rabbitmq');
const { sendEmail } = require('../services/email.service');
const { format } = require('date-fns');

const formatDateTime = (dateString) => {
  if (!dateString) return 'Tanggal tidak tersedia';
  return format(new Date(dateString), "dd MMMM yyyy, 'pukul' HH:mm");
};

async function startWorker() {
  try {
    const { channel } = await connect();
    const queueName = 'notification_queue';

    await channel.assertQueue(queueName, { durable: true });
    console.log(`[*] Menunggu pesan notifikasi di antrean '${queueName}'.`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log(`[x] Pesan diterima: tipe '${message.type}'`);

        const { data } = message;
        
        const patient = data.patient;
        const doctor = data.doctor;

        switch (message.type) {
          case 'SCHEDULE_CREATED':
            // Kirim email pembuatan jadwal ke Pasien
            if (patient && patient.email) {
              await sendEmail({
                to: patient.email,
                subject: 'Pendaftaran Jadwal Berhasil!',
                html: `
                  <h1>Halo, ${patient.name}!</h1>
                  <p>Jadwal konsultasi Anda dengan <strong>Dr. ${doctor.name}</strong> telah berhasil dibuat.</p>
                  <p><strong>Detail Jadwal:</strong></p>
                  <ul>
                    <li>Tanggal & Waktu: <strong>${formatDateTime(data.date)}</strong></li>
                    <li>Status: <strong>${data.status}</strong></li>
                  </ul>
                  <p>Terima kasih telah menggunakan layanan kami.</p>
                `,
              });
            }
            // Kirim email pembuatan jadwal ke Dokter
            if (doctor && doctor.email) {
                await sendEmail({
                  to: doctor.email, // doctor.email
                  subject: 'Jadwal Baru dengan Pasien',
                  html: `
                    <h1>Halo, Dr. ${doctor.name}!</h1>
                    <p>Anda memiliki jadwal konsultasi baru dengan pasien bernama <strong>${patient.name}</strong>.</p>
                    <p><strong>Detail Jadwal:</strong></p>
                    <ul>
                      <li>Tanggal & Waktu: <strong>${formatDateTime(data.date)}</strong></li>
                      <li>Status: <strong>${data.status}</strong></li>
                    </ul>
                    <p>Mohon periksa kalender Anda.</p>
                  `,
                });
              }
            break;

          case 'SCHEDULE_UPDATED':
            // Kirim email update schedule ke Pasien
            if (patient && patient.email) {
              await sendEmail({
                to: patient.email,
                subject: 'Informasi Perubahan Jadwal',
                html: `
                  <h1>Halo, ${patient.name}!</h1>
                  <p>Ada pembaruan pada jadwal konsultasi Anda dengan <strong>Dr. ${doctor.name}</strong>.</p>
                  <p><strong>Detail Jadwal Terbaru:</strong></p>
                  <ul>
                    <li>Tanggal & Waktu: <strong>${formatDateTime(data.date)}</strong></li>
                    <li>Status: <strong>${data.status}</strong></li>
                  </ul>
                  <p>Silakan periksa detailnya di aplikasi Anda.</p>
                `,
              });
            }
            break;

          default:
            console.log(`Tipe pesan tidak dikenal: ${message.type}`);
            break;
        }
        channel.ack(msg);
      }
    }, { noAck: false });

  } catch (error) {
    console.error("Gagal menjalankan worker:", error);
  }
}

startWorker();