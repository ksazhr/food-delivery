const API_URL = "http://localhost:4000/graphql";

async function loadDashboard() {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      query: `
        query {
          menus { id_produk }
          orders { id_order }
        }
      `
    })
  });

  const data = await res.json();
  document.getElementById("totalMenu").innerText = data.data.menus.length;
  document.getElementById("totalOrder").innerText = data.data.orders.length;
}

document.addEventListener("DOMContentLoaded", loadDashboard);
