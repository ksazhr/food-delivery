console.log("payment.js loaded");

const API_URL = "http://localhost:4000/graphql";
const token = localStorage.getItem("token");

const orderId = localStorage.getItem("orderId");
const amount = localStorage.getItem("orderAmount");


if (!token || !orderId || !amount) {
  window.location.href = "menu.html";
}


document.getElementById("orderIdText").innerText = `#${orderId}`;
document.getElementById("orderTotalText").innerText = `Rp${amount}`;


async function payOrder() {
  const query = `
    mutation PayOrder($id: Int!, $amount: Int!) {
      payOrder(id_order: $id, amount: $amount) {
        id_payment
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
    body: JSON.stringify({
      query,
      variables: {
        id: parseInt(orderId),
        amount: parseInt(amount)
      }
    })
  });

  const data = await res.json();
  console.log("Payment response:", data);

  if (data.errors) {
    alert(data.errors[0].message);
    return;
  }

  
  localStorage.removeItem("orderId");
  localStorage.removeItem("orderAmount");

  
  window.location.href = "orders.html";
}

function cancelPayment() {
  window.location.href = "menu.html";
}
