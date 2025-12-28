console.log("admin-menu.js loaded");

const API_URL = "http://localhost:4000/graphql";
const menuList = document.getElementById("menuList");

/* =====================
   FETCH MENU
===================== */
async function fetchMenus() {
  const query = `
    query {
      menus {
        id_produk
        nama_produk
        harga
        stok
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const result = await res.json();

  menuList.innerHTML = "";

  result.data.menus.forEach(menu => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${menu.nama_produk}</td>
      <td>Rp${menu.harga}</td>
      <td>${menu.stok}</td>
      <td>
        <button onclick="editMenu(
          ${menu.id_produk},
          '${menu.nama_produk}',
          ${menu.harga},
          ${menu.stok}
        )">Edit</button>
        <button onclick="hapusMenu(${menu.id_produk})">Hapus</button>
      </td>
    `;
    menuList.appendChild(tr);
  });
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  };
}


/* =====================
   TAMBAH MENU
===================== */
function addMenu() {
  const nama = document.getElementById("nama").value;
  const kategori = document.getElementById("kategori").value;
  const harga = parseInt(document.getElementById("harga").value);
  const stok = parseInt(document.getElementById("stok").value);

  console.log({ nama, kategori, harga, stok });

  if (!nama || !kategori || isNaN(harga) || isNaN(stok)) {
    alert("Lengkapi semua field");
    return;
  }

  const query = `
    mutation {
      createMenu(
        nama_produk: "${nama}",
        kategori: "${kategori}",
        harga: ${harga},
        stok: ${stok}
      ) {
        id_produk
      }
    }
  `;

  fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ query })
  })
    .then(res => res.json())
    .then(result => {
      if (result.errors) {
        alert(result.errors[0].message);
        return;
      }

      // reset input
      document.getElementById("nama").value = "";
      document.getElementById("kategori").value = "";
      document.getElementById("harga").value = "";
      document.getElementById("stok").value = "";

      fetchMenus();
    });
}

/* =====================
   EDIT MENU
===================== */
function editMenu(id, namaLama, hargaLama, stokLama) {
  const nama = prompt("Nama menu:", namaLama);
  if (nama === null) return;

  const harga = prompt("Harga:", hargaLama);
  if (harga === null) return;

  const stok = prompt("Stok:", stokLama);
  if (stok === null) return;

  const query = `
    mutation {
      updateMenu(
        id_produk: ${id},
        nama_produk: "${nama}",
        harga: ${parseInt(harga)},
        stok: ${parseInt(stok)}
      ) {
        id_produk
      }
    }
  `;

  fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ query })
  }).then(() => fetchMenus());

}

/* =====================
   HAPUS MENU
===================== */
function hapusMenu(idProduk) {
  if (!confirm("Yakin hapus menu ini?")) return;

  const query = `
    mutation {
      deleteMenu(id_produk: ${idProduk}) {
        id_produk
      }
    }
  `;

  fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ query })
  }).then(() => fetchMenus());

}

document.addEventListener("DOMContentLoaded", fetchMenus);
