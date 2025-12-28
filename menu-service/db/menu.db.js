const mysql = require('mysql2/promise');

async function connectMenuDB(retry = 10) {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: 'food_menu',
      port: 3306
    });

    await pool.query('SELECT 1');
    console.log('✅ menu DB connected');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id_produk INT AUTO_INCREMENT PRIMARY KEY,
        nama_produk VARCHAR(100) NOT NULL,
        harga INT NOT NULL,
        kategori VARCHAR(100),
        stok INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) AS total FROM menu'
    );

    if (total === 0) {
      console.log('🌱 seeding menu data...');
      const menus = [
        ['Nasi Goreng', 20000, 'Makanan', 20],
        ['Ayam Geprek Sambal Bawang', 18000, 'Makanan', 15],
        ['Mie Ayam Bakso', 18000, 'Makanan', 25],
        ['Sate Ayam Madura', 27000, 'Makanan', 10],
        ['Soto Betawi', 24000, 'Makanan', 12],
        ['Nasi Uduk Komplit', 15000, 'Makanan', 14],
        ['Es Teh Manis', 5000, 'Minuman', 30],
        ['Kopi Susu Gula Aren', 10000, 'Minuman', 18],
        ['Jus Jeruk', 10000, 'Minuman', 22],
        ['Air Mineral 600ml', 5000, 'Minuman', 40]
      ];

      for (const m of menus) {
        await pool.query(
          `INSERT INTO menu (nama_produk, harga, kategori, stok)
           VALUES (?, ?, ?, ?)`,
          m
        );
      }
      console.log('✅ menu seeded');
    }

    return pool;

  } catch (err) {
    console.log(`⏳ menu DB retry ${retry}`);
    if (retry === 0) throw err;
    await new Promise(r => setTimeout(r, 3000));
    return connectMenuDB(retry - 1);
  }
}

module.exports = connectMenuDB;
