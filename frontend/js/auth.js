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
   HELPER: DECODE JWT
====================== */
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

/* ======================
   REGISTER
====================== */
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerResult.innerText = "Mendaftarkan akun...";

    const query = `
      mutation Register($nama: String!, $email: String!, $password: String!) {
        register(nama: $nama, email: $email, password: $password) {
          id
        }
      }
    `;

    try {
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

      if (data.errors) {
        registerResult.innerText = data.errors[0].message;
        return;
      }

      registerForm.reset();
      registerResult.innerText = "Registrasi berhasil, silakan login";
      window.location.hash = "#login";

    } catch (err) {
      registerResult.innerText = "Terjadi kesalahan.";
      console.error(err);
    }
  });
}

/* ======================
   LOGIN (USER & ADMIN)
====================== */
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginResult.innerText = "Login diproses...";

    const query = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;

    try {
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

      if (data.errors) {
        loginResult.innerText = data.errors[0].message;
        return;
      }

      const token = data.data.login;
      localStorage.setItem("token", token);

      const payload = parseJwt(token);
      if (!payload || !payload.role) {
        loginResult.innerText = "Token tidak valid.";
        return;
      }

      localStorage.setItem("role", payload.role);

      // 🚦 REDIRECT SESUAI ROLE
      if (payload.role === "ADMIN") {
        window.location.href = "admin/dashboard.html";
      } else {
        window.location.href = "menu.html";
      }

    } catch (err) {
      loginResult.innerText = "Terjadi kesalahan saat login.";
      console.error(err);
    }
  });
}
