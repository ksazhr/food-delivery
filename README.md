# 🍔 Food Ordering System

GraphQL Microservices menggunakan **Docker**, **MySQL**, dan **API Gateway**.

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

Cek instalasi Docker:

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

Pastikan container berikut berjalan:
- mysql
- user-service
- menu-service
- order-service
- payment-service
- gateway

---

## 3️⃣ Endpoint GraphQL (Gateway)

Semua request dilakukan melalui Gateway:

```
http://localhost:4000/graphql
```

Gunakan **Postman → Tab GraphQL**.

---

Note : Jika Ingin Membuka Website Gunakan LiveServer atau http://127.0.0.1:5500/frontend/

## 4️⃣ Login/Register (WAJIB – Admin & User)

```graphql
mutation {
  login(
    email: "admin@mail.com"
    password: "12345678"
  )}
```

```graphql
mutation {
  register(
    nama: "Budi"
    email: "budi@mail.com"
    password: "12345678"
  ) {
    id
    nama
    email
    role
  }
}

```

---

## 5️⃣ Authorization (Postman)

Tambahkan Header:

```
Authorization: Bearer <TOKEN_DARI_LOGIN>
```

---

# 👤 ROLE: ADMIN

---

## A1️⃣ Lihat Semua User  
(Tidak melalui Gateway)

Endpoint:
```
http://localhost:3003/graphql
```

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

---

## A2️⃣ Tambah Menu

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

## A2️3️⃣ Update Menu

```graphql
mutation {
  updateMenu(
    id_produk: 2
    nama_produk: "Ayam Geprek Sambal Bawang"
    harga: 18000
    kategori: "Makanan"
    stok: 50
  ) {
    id_produk
    nama_produk
    harga
    kategori
    stok
  }
}
```

---

## A3️4️⃣ Update Status Pesanan

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

---

## A4️5️⃣ Hapus Menu

```graphql
mutation {
  deleteMenu(id_produk: 1) {
    id_produk
    nama_produk
  }
}
```

---

# 👥 ROLE: USER

---

## U1️⃣ Lihat Semua Menu

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

## U2️⃣ Buat Order

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

## U3️⃣ Lihat Semua Order

```graphql
query {
  orders {
    id_order
    total_harga
    status
  }
}
```

---

## U4️⃣ Bayar Order

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

---

## ℹ️ Catatan

- Jika `order(id)` bernilai `null` namun `orders` berhasil:
  - Kemungkinan menu pada order sudah dihapus
  - Query detail order menggunakan JOIN
- Setelah pembayaran berhasil, status order akan otomatis berubah

---
