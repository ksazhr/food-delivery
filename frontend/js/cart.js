console.log("cart.js loaded");

const API_URL = "http://localhost:4000/graphql";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const cartList = document.getElementById("cartList");
let cart = JSON.parse(localStorage.getItem("cart")) || [];


function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Keranjang masih kosong.</p>";
    return;
  }

  cart.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <h3>${item.nama_produk}</h3>
      <p>Harga: Rp${item.harga}</p>
      <p>Jumlah: ${item.jumlah}</p>
      <p><strong>Subtotal:</strong> Rp${item.harga * item.jumlah}</p>

      <button 
        style="background:#e53935; margin-top:10px;"
        onclick="removeItem(${index})">
        🗑️ Hapus
      </button>
    `;

    cartList.appendChild(card);
  });
}


function removeItem(index) {
  if (!confirm("Hapus item dari keranjang?")) return;

  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}


async function checkout() {
  if (cart.length === 0) {
    alert("Keranjang kosong");
    return;
  }

  try {
   
    const createRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        query: `
          mutation {
            createOrder(
              id_produk: ${cart[0].id_produk}
              jumlah: ${cart[0].jumlah}
            ) {
              id_order
              total_harga
            }
          }
        `
      })
    });

    const createData = await createRes.json();
    if (createData.errors) {
      alert("Gagal membuat order");
      return;
    }

    const orderId = createData.data.createOrder.id_order;
    let totalHarga = createData.data.createOrder.total_harga;

    
    for (let i = 1; i < cart.length; i++) {
      const item = cart[i];

      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          query: `
            mutation {
              addOrderItem(
                id_order: ${orderId}
                id_produk: ${item.id_produk}
                jumlah: ${item.jumlah}
              ) {
                id_item
              }
            }
          `
        })
      });

      totalHarga += item.harga * item.jumlah;
    }

    
    localStorage.removeItem("cart");
    localStorage.setItem("orderId", orderId);
    localStorage.setItem("orderAmount", totalHarga);

    window.location.href = "payment.html";

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan");
  }
}


function backToMenu() {
  window.location.href = "menu.html";
}


renderCart();
