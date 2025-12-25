const mysql = require('mysql2/promise');

async function connectOrderDB(retry = 10) {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: 'food_order',
      port: 3306
    });

    await pool.query('SELECT 1');
    console.log('✅ order DB connected');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id_order INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        total_harga INT NOT NULL DEFAULT 0,
        status ENUM('PENDING','DIPROSES','DIKIRIM','SELESAI','BATAL') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id_item INT AUTO_INCREMENT PRIMARY KEY,
        id_order INT NOT NULL,
        id_produk INT NOT NULL,
        jumlah INT NOT NULL,
        harga_satuan INT NOT NULL,
        subtotal INT NOT NULL,
        FOREIGN KEY (id_order) REFERENCES orders(id_order)
          ON DELETE CASCADE
      );
    `);

    console.log('✅ orders & order_items tables ready');
    return pool;

  } catch (err) {
    console.log(`⏳ order DB belum siap, retry ${retry}`);
    if (retry === 0) throw err;
    await new Promise(r => setTimeout(r, 3000));
    return connectOrderDB(retry - 1);
  }
}

module.exports = connectOrderDB;
