console.log("auth.js loaded");

const API_URL = "http://localhost:4000/graphql";

// ===== ELEMENT LOGIN =====
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginResult = document.getElementById("loginResult");

// ===== ELEMENT REGISTER =====
const registerForm = document.getElementById("registerForm");
const regNama = document.getElementById("regNama");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const registerResult = document.getElementById("registerResult");

/* ======================
   REGISTER
   → BERHASIL PINDAH KE LOGIN
====================== */
if (registerForm) {
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    registerResult.innerText = "Mendaftarkan akun...";

    const query = `
      mutation Register($nama: String!, $email: String!, $password: String!) {
        register(nama: $nama, email: $email, password: $password) {
          id
        }
      }
    `;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          nama: regNama.value,
          email: regEmail.value,
          password: regPassword.value
        }
      })
    });

    const data = await res.json();
    console.log("Register response:", data);

    if (data.errors) {
      registerResult.innerText = data.errors[0].message;
      return;
    }

    // REGISTER BERHASIL
    registerForm.reset();
    registerResult.innerText = "";

    // PINDAH KE LOGIN
    window.location.hash = "#login";
  });
}

/* ======================
   LOGIN
====================== */
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    loginResult.innerText = "Login diproses...";

    const query = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          email: loginEmail.value,
          password: loginPassword.value
        }
      })
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (data.errors) {
      loginResult.innerText = data.errors[0].message;
      return;
    }

    // LOGIN BERHASIL → SIMPAN TOKEN
    localStorage.setItem("token", data.data.login);

    // MASUK KE MENU
    window.location.href = "menu.html";
  });
}
