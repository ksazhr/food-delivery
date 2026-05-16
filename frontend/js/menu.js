console.log("menu.js loaded");

const API_URL = "http://localhost:4000/graphql";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const menuList = document.getElementById("menuList");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


async function fetchMenu() {
  const query = `
    query {
      menus {
        id_produk
        nama_produk
        harga
        kategori
        stok
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();

  if (data.errors) {
    console.error(data.errors);
    return;
  }

  if (!data.data.menus || data.data.menus.length === 0) {
    menuList.innerHTML = "<p>Menu belum tersedia</p>";
    return;
  }

  menuList.innerHTML = "";

  data.data.menus.forEach(menu => {
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <h3>${menu.nama_produk}</h3>
      <p>Harga: Rp${menu.harga}</p>
      <p>Kategori: ${menu.kategori}</p>
      <p>Stok: ${menu.stok}</p>

      <label>Jumlah:</label>
      <input 
        type="number" 
        id="qty-${menu.id_produk}" 
        value="1" 
        min="1" 
        max="${menu.stok}"
      >

      <button onclick="addToCart(
        ${menu.id_produk},
        '${menu.nama_produk}',
        ${menu.harga}
      )">
        ➕ Tambah ke Keranjang
      </button>
    `;

    menuList.appendChild(card);
  });
}


function addToCart(idProduk, nama, harga) {
  const qtyInput = document.getElementById(`qty-${idProduk}`);
  const jumlah = parseInt(qtyInput.value);

  if (!jumlah || jumlah < 1) {
    alert("Jumlah tidak valid");
    return;
  }

  const existing = cart.find(item => item.id_produk === idProduk);

  if (existing) {
    existing.jumlah += jumlah;
  } else {
    cart.push({
      id_produk: idProduk,
      nama_produk: nama,
      harga,
      jumlah
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${nama} ditambahkan ke keranjang`);
}


fetchMenu();
