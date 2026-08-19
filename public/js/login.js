// ================================
// LOGIN USING MONGODB
// ================================

const API = "/api/auth/login";

async function login() {

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value.trim();

    if (!username || !password) {

        alert("Please enter your username and password.");

        return;

    }

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username,

                password

            })

        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        // Save login information

        localStorage.setItem("token", data.token);

        localStorage.setItem("role", data.role);

        localStorage.setItem("fullName", data.fullName);

       // ==========================================
        // SAVE TEACHER ASSIGNMENT
        // ==========================================

        localStorage.setItem(
            "grade",
            data.grade || ""
        );

        localStorage.setItem(
            "section",
            data.section || ""
        );

        // Also save specifically for teacher filtering
        localStorage.setItem(
            "teacherGrade",
            data.grade || ""
        );

        localStorage.setItem(
            "teacherSection",
            data.section || ""
        );

        // Redirect

        window.location.href = "index.html";

    }

    catch (err) {

        console.error(err);

        alert("Unable to connect to the server.");

    }

}

// ===========================
// SHOW / HIDE PASSWORD
// ===========================

const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");

        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");

        togglePassword.classList.add("fa-eye");

    }

});