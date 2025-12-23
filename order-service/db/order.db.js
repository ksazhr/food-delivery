const mysql = require('mysql2');

const orderDB = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'food_order',
  port: 3308
});

module.exports = orderDB.promise();
async function runOrderMigrations() {
  try {
    console.log('Running order migrations...');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id_order INT AUTO_INCREMENT PRIMARY KEY,
        id_produk INT NOT NULL,
        jumlah INT NOT NULL,
        total_harga INT NOT NULL,
        status ENUM('Pending', 'Diproses', 'Dikirim', 'Selesai', 'Batal') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await orderDB.promise().query(createTableQuery);
    console.log('Order table is ready.');
  } catch (error) {
    console.error('Order migration failed:', error);
  }
}

// Jalankan migrasi
runOrderMigrations();