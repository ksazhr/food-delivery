const loginCard = document.getElementById("loginCard");
const registerCard = document.getElementById("registerCard");

function showForm() {
  const hash = window.location.hash;

 
  loginCard.style.display = "none";
  registerCard.style.display = "none";

  if (hash === "#register") {
    registerCard.style.display = "block";
  } else {
    
    loginCard.style.display = "block";
  }
}

showForm();


window.addEventListener("hashchange", showForm);
