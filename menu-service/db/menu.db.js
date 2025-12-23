const mysql = require('mysql2/promise');

const menuDB = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'food_menu',
  port: 3308
});

module.exports = menuDB;
module.exports.runMenuMigrations = runMenuMigrations;

// Migration and Seeder for Menu
async function runMenuMigrations() {
  try {
    console.log('Running menu migrations...');

    // 1. Create table menu
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS menu (
        id_produk INT AUTO_INCREMENT PRIMARY KEY,
        nama_produk VARCHAR(100) NOT NULL,
        harga INT NOT NULL,
        kategori VARCHAR(100),
        stok INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await menuDB.query(createTableQuery);

    // 2. Seed data
    const menus = [
      { nama_produk: 'Nasi Goreng', harga: 20000, kategori: 'Makanan', stok: 20 },
      { nama_produk: 'Ayam Geprek Sambal Bawang', harga: 18000, kategori: 'Makanan', stok: 15 },
      { nama_produk: 'Mie Ayam Bakso', harga: 18000, kategori: 'Makanan', stok: 25 },
      { nama_produk: 'Sate Ayam Madura', harga: 27000, kategori: 'Makanan', stok: 10 },
      { nama_produk: 'Soto Betawi', harga: 24000, kategori: 'Makanan', stok: 12 },
      { nama_produk: 'Nasi Uduk Komplit', harga: 15000, kategori: 'Makanan', stok: 14 },
      { nama_produk: 'Es Teh Manis', harga: 5000, kategori: 'Minuman', stok: 30 },
      { nama_produk: 'Kopi Susu Gula Aren', harga: 10000, kategori: 'Minuman', stok: 18 },
      { nama_produk: 'Jus Jeruk', harga: 10000, kategori: 'Minuman', stok: 22 },
      { nama_produk: 'Air Mineral 600ml', harga: 5000, kategori: 'Minuman', stok: 40 }
    ];

    for (const menu of menus) {
      const insertQuery = `
        INSERT IGNORE INTO menu (nama_produk, harga, kategori, stok)
        VALUES (?, ?, ?, ?)
      `;
      await menuDB.query(insertQuery, [menu.nama_produk, menu.harga, menu.kategori, menu.stok]);
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMenuMigrations();