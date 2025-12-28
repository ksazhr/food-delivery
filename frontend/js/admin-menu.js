console.log("admin-menu.js loaded");

const API_URL = "http://localhost:4000/graphql";
const menuList = document.getElementById("menuList");

async function fetchMenus() {
  const query = `
    query {
      menus {
        id_produk
        nama_produk
        harga
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();

  menuList.innerHTML = "";

  data.data.menus.forEach(menu => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${menu.nama_produk}</td>
      <td>Rp${menu.harga}</td>
      <td>
        <button onclick="hapusMenu(${menu.id_produk})">Hapus</button>
      </td>
    `;
    menuList.appendChild(tr);
  });
}

async function hapusMenu(idProduk) {
  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      query: `
        mutation {
          deleteMenu(id_produk: ${idProduk}) {
            id_produk
          }
        }
      `
    })
  });

  fetchMenus(); // ✅ LANGSUNG PANGGIL
}

document.addEventListener("DOMContentLoaded", fetchMenus);
