console.log("admin-orders.js loaded");

const API_URL = "http://localhost:4000/graphql";

const orderList = document.getElementById("orderList");

/* ======================
   FETCH SEMUA ORDER (ADMIN)
====================== */
async function fetchOrders() {
  const query = `
    query {
      orders {
        id_order
        total_harga
        status
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

  if (data.errors || !data.data.orders) {
    orderList.innerHTML =
      "<tr><td colspan='4'>Gagal mengambil data order</td></tr>";
    return;
  }

  if (data.data.orders.length === 0) {
    orderList.innerHTML =
      "<tr><td colspan='4'>Belum ada order</td></tr>";
    return;
  }

  orderList.innerHTML = "";

  data.data.orders.forEach(order => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>#${order.id_order}</td>
      <td>Rp${order.total_harga}</td>
      <td>${order.status}</td>
      <td>
        ${
          order.status === "PENDING"
            ? `<button class="btn-success"
                onclick="selesaikanOrder(${order.id_order})">
                Tandai Selesai
               </button>`
            : "-"
        }
      </td>
    `;

    orderList.appendChild(tr);
  });
}

/* ======================
   UPDATE STATUS → SELESAI
====================== */
async function selesaikanOrder(idOrder) {
  if (!confirm("Tandai order ini sebagai SELESAI?")) return;

  const query = `
    mutation {
      updateOrderStatus(
        id_order: ${idOrder},
        status: SELESAI
      ) {
        id_order
      }
    }
  `;

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ query })
  });

  fetchOrders();
}


fetchOrders();
