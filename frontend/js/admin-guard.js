
console.log("admin-guard loaded");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


if (!token) {
  alert("Silakan login terlebih dahulu");
  window.location.href = "../auth.html";
}


if (role !== "ADMIN") {
  alert("Akses ditolak!");
  window.location.href = "../menu.html";
}
