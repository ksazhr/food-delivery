const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'food_order',
  port: 3308
});

const orderDB = pool.promise();
module.exports = orderDB;

async function runOrderMigrations() {
  try {
    console.log('Running order migrations...');

    // 1️⃣ Parent table DULU
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id_order INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        total_harga INT NOT NULL DEFAULT 0,
        status ENUM('PENDING','DIPROSES','DIKIRIM','SELESAI','BATAL') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2️⃣ Child table SETELAHNYA
    const createOrderItemsTable = `
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
    `;

    await orderDB.query(createOrdersTable);
    await orderDB.query(createOrderItemsTable);

    console.log('Order & Order Items tables are ready.');
  } catch (error) {
    console.error('Order migration failed:', error);
  }
}

// Jalankan migrasi
runOrderMigrations();
