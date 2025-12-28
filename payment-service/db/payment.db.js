const mysql = require('mysql2/promise');

let pool; // 🔥 singleton

async function connectDB(retry = 10) {
  try {
    if (pool) return pool; 

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: 'food_payment',
      port: 3306
    });

    await pool.query('SELECT 1');
    console.log('✅ payment DB connected');

    return pool;
  } catch (err) {
    console.log(`⏳ payment DB belum siap, retry ${retry}`);
    if (retry === 0) throw err;
    await new Promise(r => setTimeout(r, 3000));
    pool = null;
    return connectDB(retry - 1);
  }
}

async function runPaymentMigrations(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id_payment INT AUTO_INCREMENT PRIMARY KEY,
      id_order INT NOT NULL,
      amount INT NOT NULL,
      status ENUM('SUCCESS', 'FAILED') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function initPaymentDB() {
  const db = await connectDB();
  await runPaymentMigrations(db);
  return db;
}

module.exports = initPaymentDB;
