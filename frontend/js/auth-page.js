const loginCard = document.getElementById("loginCard");
const registerCard = document.getElementById("registerCard");

function showForm() {
  const hash = window.location.hash;

  // Sembunyikan semua dulu
  loginCard.style.display = "none";
  registerCard.style.display = "none";

  if (hash === "#register") {
    registerCard.style.display = "block";
  } else {
    // default = login
    loginCard.style.display = "block";
  }
}

showForm();

// Kalau hash berubah (user klik back / forward)
window.addEventListener("hashchange", showForm);
