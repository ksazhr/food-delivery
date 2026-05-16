console.log("orders.js loaded");

const API_URL = "http://localhost:4000/graphql";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const orderList = document.getElementById("orderList");


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
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log("Orders response:", data);

  if (data.errors) {
    orderList.innerHTML = "<p>Gagal mengambil data order.</p>";
    return;
  }

  if (!data.data.orders || data.data.orders.length === 0) {
    orderList.innerHTML = "<p>Belum ada order.</p>";
    return;
  }

  orderList.innerHTML = "";

  data.data.orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "menu-card";

    let actionButton = "";

    
    if (order.status.toUpperCase() === "PENDING") {
      actionButton = `
        <button class="pay-btn-small"
          onclick="payAgain(${order.id_order}, ${order.total_harga})">
          💳 Bayar Sekarang
        </button>
      `;
    }

    card.innerHTML = `
      <h3>Order #${order.id_order}</h3>
      <p>Total: Rp${order.total_harga}</p>
      <p>Status: ${order.status}</p>
      ${actionButton}
    `;

    orderList.appendChild(card);
  });
}


function payAgain(orderId, total) {
  localStorage.setItem("orderId", orderId);
  localStorage.setItem("orderAmount", total);
  window.location.href = "payment.html";
}

function backToMenu() {
  window.location.href = "menu.html";
}

fetchOrders();
