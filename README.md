# 🍔 Food Ordering System

GraphQL Microservices menggunakan **Docker**, **MySQL**, dan **Gateway**.

---

## 🧰 Teknologi
- Node.js
- Express
- GraphQL
- MySQL
- Docker & Docker Compose
- Postman

---

## 1️⃣ Install Docker

Download Docker Desktop:  
https://www.docker.com/products/docker-desktop/

Pastikan Docker sudah berjalan dengan membuka terminal / CMD:

```bash
docker --version
docker compose version
```

---

## 2️⃣ Jalankan Project

Masuk ke folder project, lalu jalankan:

```bash
docker compose up --build
```

Tunggu sampai semua service berjalan:
- mysql
- user-service
- menu-service
- order-service
- payment-service
- gateway

---

## 3️⃣ Endpoint GraphQL (Gateway)

Semua request dilakukan melalui Gateway:

http://localhost:4000/graphql

Gunakan **Postman** → Tab **GraphQL**.

---

## 4️⃣ Login (Wajib)

### Login Admin / User

```graphql
mutation {
  login(
    email: "admin@mail.com"
    password: "12345678"
  ) {
    token
    role
  }
}
```

Simpan `token` dari response.

---

## 5️⃣ Set Authorization (Postman)

Masuk ke tab **Headers**, tambahkan:

```
Authorization: Bearer <TOKEN_DARI_LOGIN>
```

---

## 6️⃣ Admin – Lihat Semua User (Tidak melalui Gateway - Gunakan http://localhost:3003/graphql)

```graphql
query {
  users {
    id
    nama
    email
    role
  }
}
```

Catatan: hanya bisa diakses oleh **ADMIN**.

---

## 7️⃣ Admin – Tambah Menu

```graphql
mutation {
  createMenu(
    nama_produk: "Ayam Geprek"
    kategori: "Makanan"
    harga: 15000
    stok: 10
  ) {
    id_produk
    nama_produk
    harga
    stok
  }
}
```

---

## 8️⃣ User – Lihat Semua Menu

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

---

## 9️⃣ User – Buat Order

```graphql
mutation {
  createOrder(
    id_produk: 1
    jumlah: 2
  ) {
    id_order
    total_harga
    status
  }
}
```

---

## 🔟 User – Lihat Semua Order

```graphql
query {
  orders {
    id_order
    total_harga
    status
  }
}
```

Catatan:
- Jika `order(id)` bernilai `null`
- Tetapi `orders` berhasil
- Kemungkinan menu pada order sudah dihapus
- Karena query detail order menggunakan JOIN

---

## 1️⃣2️⃣ User – Bayar Order

```graphql
mutation {
  payOrder(
    id_order: 1
    amount: 30000
  ) {
    id_payment
    status
  }
}
```

Setelah pembayaran, status order akan otomatis berubah.

---

## 1️⃣3️⃣ Admin – Hapus Menu

```graphql
mutation {
  deleteMenu(id_produk: 1) {
    id_produk
    nama_produk
  }
}
```

## 1️⃣3️⃣ Admin – Update Status Pemesanan

```graphql
mutation {
  updateOrderStatus(
    id_order: 1
    status: SELESAI
  ) {
    id_order
    status
  }
}

```


Catatan:
Menghapus menu yang sudah pernah dipesan dapat menyebabkan
detail order tidak bisa ditampilkan.

---

## ✅ Selesai

Project berhasil dijalankan jika:
- Docker berjalan
- Gateway dapat diakses
- Query GraphQL berhasil dijalankan di Postman
