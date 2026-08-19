const API = "http://localhost:3000/api";

let logs = [];

window.onload = () => {

    loadLogs();

};

// ===============================
// Load Logs
// ===============================
async function loadLogs() {

    try {

        const response = await fetch(`${API}/systemlogs`);

        logs = await response.json();

        displayLogs(logs);

    } catch (err) {

        console.error(err);

    }

}

// ===============================
// Display Logs
// ===============================
function displayLogs(data) {

    const table = document.getElementById("logsTable");

    table.innerHTML = "";

    data.forEach(log => {

        table.innerHTML += `

        <tr>

            <td>${log.activity}</td>

            <td>${log.description}</td>

            <td>${log.status}</td>

            <td>${new Date(log.createdAt).toLocaleString()}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteLog('${log._id}')">

                    <i class="fa-solid fa-trash"></i>
                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ===============================
// Delete One Log
// ===============================
async function deleteLog(id) {

    if (!confirm("Delete this log?")) return;

    try {

        await fetch(`${API}/systemlogs/${id}`, {

            method: "DELETE"

        });

        loadLogs();

    } catch (err) {

        console.error(err);

    }

}
async function deleteAllLogs() {

    if (!confirm("Are you sure you want to delete ALL logs?")) return;

    try {

        const response = await fetch(
            "/api/systemlogs",
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        alert(data.message);

        loadLogs();

    } catch (err) {

        console.error(err);

        alert("Failed to delete logs.");

    }

}