console.log("admin-menu.js loaded");

const API_URL = "http://localhost:4000/graphql";
const token = localStorage.getItem("token");

const menuList = document.getElementById("menuList");

/* ======================
   FETCH MENU (ADMIN)
====================== */
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

/* ======================
   HAPUS MENU
====================== */
async function hapusMenu(idMenu) {
  if (!confirm("Yakin ingin menghapus menu ini?")) return;

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
