const mysql = require('mysql2/promise');

const userDB = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'food_user',
  port: 3308
});

module.exports = userDB;
module.exports.runUserMigrations = runUserMigrations;

// Migration and Seeder for User
async function runUserMigrations() {
  try {
    console.log('Running user migrations...');

    // 1. Create table user
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('USER', 'ADMIN') DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await userDB.query(createTableQuery);

    // 2. Seed data
    const bcrypt = require('bcryptjs');

    const users = [
      { nama: 'Admin', email: 'admin@mail.com', password: '12345678', role: 'ADMIN' },
      { nama: 'John Doe', email: 'john@mail.com', password: '12345678', role: 'USER' },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const insertQuery = `
        INSERT IGNORE INTO users (nama, email, password, role)
        VALUES (?, ?, ?, ?)
      `;
      await userDB.query(insertQuery, [user.nama, user.email, hashedPassword, user.role]);
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runUserMigrations();