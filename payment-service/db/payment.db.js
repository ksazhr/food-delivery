const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',          
  database: 'food_payment',
  port: 3308
});

// 1. Buat satu variabel promise
const paymentDB = pool.promise();

async function runPaymentMigrations() {
  try {
    console.log('Running payment migrations...');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS payments (
        id_payment INT AUTO_INCREMENT PRIMARY KEY,
        id_order INT NOT NULL,
        amount INT NOT NULL,
        status ENUM('SUCCESS', 'FAILED') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // 2. Gunakan langsung tanpa .promise() lagi
    await paymentDB.query(createTableQuery);
    console.log('Payment table is ready.');
  } catch (error) {
    console.error('Payment migration failed:', error);
  }
}

runPaymentMigrations();

// 3. Export variabel promise tadi
module.exports = paymentDB;