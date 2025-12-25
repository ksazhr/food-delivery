// admin-guard.js
console.log("admin-guard loaded");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Belum login
if (!token) {
  alert("Silakan login terlebih dahulu");
  window.location.href = "../auth.html";
}

// Bukan admin
if (role !== "ADMIN") {
  alert("Akses ditolak!");
  window.location.href = "../menu.html";
}
