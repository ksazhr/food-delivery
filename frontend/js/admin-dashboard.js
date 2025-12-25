const API_URL = "http://localhost:4000/graphql";
const token = localStorage.getItem("token");

async function loadDashboard() {
  const query = `
    query {
      menus { id_menu }
      orders { id_order }
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

  document.getElementById("totalMenu").innerText =
    data.data.menus.length;

  document.getElementById("totalOrder").innerText =
    data.data.orders.length;
}

loadDashboard();
