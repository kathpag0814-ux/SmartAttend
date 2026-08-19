// ================================
// Temporary Frontend Login
// ================================

function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Temporary Admin Account
    if (username === "Kathleen" && password === "kath123") {

        localStorage.setItem("token", "loggedin");

        window.location.href = "index.html";

    } else {

        alert("Invalid Username or Password");

    }

}