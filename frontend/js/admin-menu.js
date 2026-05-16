console.log("admin-menu.js loaded");

const API_URL = "http://localhost:4000/graphql";
const token = localStorage.getItem("token");

const menuList = document.getElementById("menuList");

<<<<<<< Updated upstream
/* ======================
   FETCH MENU (ADMIN)
====================== */
=======

>>>>>>> Stashed changes
async function fetchMenus() {
  const query = `
    query {
      menus {
        id_menu
        nama
        harga
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

  if (data.errors || !data.data.menus) {
    menuList.innerHTML =
      "<tr><td colspan='3'>Gagal mengambil menu</td></tr>";
    return;
  }

  if (data.data.menus.length === 0) {
    menuList.innerHTML =
      "<tr><td colspan='3'>Belum ada menu</td></tr>";
    return;
  }

  menuList.innerHTML = "";

  data.data.menus.forEach(menu => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${menu.nama}</td>
      <td>Rp${menu.harga}</td>
      <td>
        <button class="btn-danger"
          onclick="hapusMenu(${menu.id_menu})">
          Hapus
        </button>
      </td>
    `;

    menuList.appendChild(tr);
  });
}

<<<<<<< Updated upstream
/* ======================
   HAPUS MENU
====================== */
async function hapusMenu(idMenu) {
  if (!confirm("Yakin ingin menghapus menu ini?")) return;
=======
function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  };
}



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


function hapusMenu(idProduk) {
  if (!confirm("Yakin hapus menu ini?")) return;
>>>>>>> Stashed changes

  const query = `
    mutation {
      deleteMenu(id_menu: ${idMenu})
    }
  `;

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ query })
  });

  fetchMenus();
}

fetchMenus();
