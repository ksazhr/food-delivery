const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function connectUserDB(retry = 10) {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: 'food_user',
      port: 3306
    });

    await pool.query('SELECT 1');
    console.log('✅ user DB connected');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('USER', 'ADMIN') DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const users = [
      ['Admin', 'admin@mail.com', await bcrypt.hash('12345678', 10), 'ADMIN'],
      ['John Doe', 'john@mail.com', await bcrypt.hash('12345678', 10), 'USER']
    ];

    for (const u of users) {
      await pool.query(
        `INSERT IGNORE INTO users (nama, email, password, role)
         VALUES (?, ?, ?, ?)`,
        u
      );
    }

    console.log('✅ users table & seed ready');
    return pool;

  } catch (err) {
    console.log(`⏳ user DB belum siap, retry ${retry}`);
    if (retry === 0) throw err;
    await new Promise(r => setTimeout(r, 3000));
    return connectUserDB(retry - 1);
  }
}

module.exports = connectUserDB;
