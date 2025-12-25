# 🍔 Food Ordering System
GraphQL Microservices dengan Docker, MySQL, dan Gateway

---

1️⃣ INSTALL DOCKER

Download Docker Desktop:
https://www.docker.com/products/docker-desktop/

Pastikan Docker jalan:
```bash
docker --version
docker compose version

2️⃣ JALANKAN PROJECT

Masuk ke folder project, lalu jalankan:

docker compose up --build

3️⃣ ENDPOINT GRAPHQL

Semua request dilakukan lewat Gateway:

http://localhost:4000/graphql


Gunakan Postman → Tab GraphQL

4️⃣ LOGIN (WAJIB)
Login Admin / User
mutation {
  login(
    email: "admin@mail.com"
    password: "password"
  ) {
    token
    role
  }
}


📌 Simpan token.

5️⃣ SET AUTHORIZATION (POSTMAN)

Tab Headers:

Authorization: Bearer <TOKEN_DARI_LOGIN>

6️⃣ ADMIN – LIHAT SEMUA USER
query {
  users {
    id
    nama
    email
    role
  }
}


⚠️ Hanya bisa diakses oleh ADMIN.

7️⃣ ADMIN – TAMBAH MENU
mutation {
  createMenu(
    nama_produk: "Ayam Geprek"
    kategori: "Makanan"
    harga: 15000
    stok: 10
  ) {
    id_produk
    nama_produk
    kategori
    harga
    stok
  }
}

8️⃣ USER – LIHAT SEMUA MENU
query {
  menus {
    id_produk
    nama_produk
    kategori
    harga
    stok
  }
}

9️⃣ USER – BUAT ORDER

📌 SESUIAI SCHEMA PROJECT (id_produk + jumlah)

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

🔟 USER – LIHAT SEMUA ORDER
query {
  orders {
    id_order
    total_harga
    status
  }
}

1️⃣1️⃣ USER / ADMIN – LIHAT ORDER BERDASARKAN ID
query {
  order(id_order: 1) {
    id_order
    total_harga
    status
  }
}


⚠️ Catatan:

Jika order(id) bernilai null

Tetapi orders berhasil

Kemungkinan menu yang terkait sudah dihapus

Karena query detail order menggunakan JOIN

1️⃣2️⃣ USER – BAYAR ORDER
mutation {
  payOrder(
    id_order: 1
    amount: 30000
  ) {
    id_payment
    status
  }
}


📌 Setelah payment:

status order otomatis berubah (misalnya DIPROSES)

1️⃣3️⃣ ADMIN – HAPUS MENU
mutation {
  deleteMenu(id_produk: 1) {
    id_produk
    nama_produk
  }
}


⚠️ Menghapus menu yang sudah pernah dipesan dapat menyebabkan
detail order (order(id)) tidak bisa ditampilkan.

🧠 CATATAN PENTING

orders → selalu bisa ditampilkan

order(id) → tergantung relasi menu

Hard delete menu dapat mempengaruhi order history

Untuk produksi disarankan soft delete

✅ SELESAI

Jika:

Docker berjalan

Gateway bisa diakses

Query GraphQL berhasil

Maka project berjalan dengan benar.


---

## 🔥 KENAPA YANG INI AMAN DICOPAS?
✔ `createOrder(id_produk, jumlah)` **sesuai schema kamu**  
✔ Tidak ada `items[]` palsu  
✔ Semua query **pernah kamu pakai & berhasil**  
✔ Tidak ngarang tabel / field  

Kalau kamu mau:
- versi **lebih singkat 1 halaman**
- versi **bahasa laporan kampus**
- atau **diagram arsitektur**

tinggal bilang — sekarang pondasinya **SUDAH BENAR** 💪
