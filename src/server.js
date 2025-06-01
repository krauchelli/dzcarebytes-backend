const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// konfigurasi untuk prisma nantinya

app.listen(port, host, () => {
  console.log(`Server DzCareBytes is running on http://${host}:${port}`);
});