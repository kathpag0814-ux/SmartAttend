// ================================
// AUTHENTICATION
// ================================

// Do not allow protected pages without a token
if (!window.location.pathname.includes("login.html")) {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
}


// ================================
// SHOW USER INFORMATION
// ================================

const fullName = localStorage.getItem("fullName");
const role = localStorage.getItem("role");

if (document.getElementById("userName")) {

    document.getElementById("userName").textContent =
        fullName || "Administrator";

}

if (document.getElementById("userRole")) {

    document.getElementById("userRole").textContent =
        role || "Admin";

}


// ================================
// HIDE ADMIN FEATURES FOR TEACHERS
// ================================

if (role === "Teacher") {

    document.querySelectorAll("nav a").forEach(link => {

        const text = link.textContent.trim();

        if (
            text === "Teachers" ||
            text === "Settings" ||
            text === "System Logs"
        ) {

            link.style.display = "none";

        }

    });

}


// ================================
// LOGOUT
// ================================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    localStorage.removeItem("grade");
    localStorage.removeItem("section");

    window.location.href = "login.html";

}