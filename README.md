# Food Delivery System

Sistem pemesanan makanan berbasis microservices menggunakan Node.js, Express, GraphQL, dan MySQL.

## Deskripsi

Proyek ini terdiri dari beberapa komponen:

* **Frontend**: Antarmuka web sederhana untuk pengguna (HTML/CSS/JavaScript)
* **Gateway**: API Gateway menggunakan GraphQL untuk mengelola permintaan
* **Menu Service**: Mengelola data menu makanan
* **Order Service**: Mengelola pesanan
* **Payment Service**: Mengelola pembayaran
* **User Service**: Mengelola data pengguna

## Prerequisites

Sebelum menjalankan proyek ini, pastikan Anda memiliki:

* **Node.js** (versi 14 atau lebih baru) - [Download di sini](https://nodejs.org/)
* **XAMPP** (untuk MySQL server) - [Download di sini](https://www.apachefriends.org/)
* **npm** (biasanya sudah terinstall dengan Node.js)

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/ksazhr/food-delivery.git
cd food-delivery-node

```

### 2. Install Dependencies

Setiap service memiliki dependencies sendiri. Jalankan perintah berikut di setiap folder service:
# Di setiap folder (gateway, menu-service, order-service, payment-service, user-service) jalankan:

```bash
npm install

```

### 3. Setup Database

1. Jalankan XAMPP dan start **MySQL** service.
2. Buat database berikut: `food_menu`, `food_order`, `food_payment`, `food_user`.
3. **Catatan**: Port default diatur ke **3308**. Jika port MySQL Anda berbeda, edit file `db/*.db.js` di setiap service.

### 4. Menjalankan Server

Buka terminal terpisah untuk setiap service dan jalankan perintah: `node server.js`.

---

## API Documentation

Semua permintaan melalui Gateway di: `http://localhost:4000/graphql`.

### 1. Public Operations (Tanpa Token)

**Register**

```graphql
mutation {
  register(nama: "migu", email: "migu@mail.com", password: "password") {
    id
    nama
    email
  } 
}

```

**Login**

```graphql
mutation {
  login(email: "migu@mail.com", password: "password")
}

```

*Gunakan token yang dihasilkan untuk langkah berikutnya.*

### 2. User Operations (Memerlukan Authorization: Bearer <token>)

**Melihat Daftar Menu**

```graphql
query {
  menus {
    id_produk
    nama_produk
    harga
    stok
  }
}

```

**Membuat Pesanan**

```graphql
mutation {
  createOrder(id_produk: 1, jumlah: 2) {
    id_order
    total_harga
    status
  }
}

```

**Membayar Pesanan**

```graphql
mutation {
  payOrder(id_order: 1, amount: 40000) {
    id_payment
    status
  }
}

```

### 3. Admin Operations (Memerlukan Authorization: Bearer <token_admin>)

**Menambah Menu Baru**

```graphql
mutation {
  createMenu(nama_produk: "Ayam Bakar", harga: 25000, kategori: "Makanan", stok: 30) {
    id_produk
    nama_produk
  }
}

```

**Update Status Pesanan**

```graphql
# Status Enum: PENDING, DIPROSES, DIKIRIM, SELESAI, BATAL
mutation {
  updateOrderStatus(id_order: 1, status: DIKIRIM) {
    id_order
    status
  }
}

```

**Menghapus Menu**

```graphql
mutation {
  deleteMenu(id_produk: 1) {
    id_produk
    nama_produk
  }
}

```

---

## Troubleshooting

* **Forbidden Internal Access**: Pastikan Anda mengakses melalui Gateway (Port 4000). Akses langsung ke microservice akan ditolak.
* **Port conflict**: Jika port sudah digunakan, ubah port di `server.js` setiap service.
* **Database error**: Pastikan MySQL running dan konfigurasi port di `db/*.db.js` sudah sesuai.

