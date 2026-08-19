

const currentRole = (localStorage.getItem("role") || "").toLowerCase();

const teacherGrade = localStorage.getItem("grade") || "";

const teacherSection = localStorage.getItem("section") || "";

console.log("Logged-in Role:", currentRole);
console.log("Teacher Grade:", teacherGrade);
console.log("Teacher Section:", teacherSection);

const API = "/api";

let records = [];



// ==============================
// Page Load
// ==============================
window.onload = () => {
    loadAttendance();
};

// ==============================
// Load Attendance
// ==============================
async function loadAttendance() {

    let url = `${API}/attendance`;

    const status =
        document.getElementById("statusFilter")?.value || "All";

    const params = [];

    // ==============================
    // TEACHER FILTER
    // ==============================
    if (currentRole === "teacher") {

        // Make sure teacher has an assigned grade
        if (!teacherGrade || !teacherSection) {

            console.error("Teacher grade or section is missing.");

            alert(
                "Your assigned grade or section is missing. Please contact the administrator."
            );

            return;
        }

        params.push(
            `grade=${encodeURIComponent(teacherGrade)}`
        );

        params.push(
            `section=${encodeURIComponent(teacherSection)}`
        );
    }

    // ==============================
    // STATUS FILTER
    // ==============================
    if (status !== "All") {

        params.push(
            `status=${encodeURIComponent(status)}`
        );

    }

    // ==============================
    // BUILD URL
    // ==============================
    if (params.length > 0) {

        url += "?" + params.join("&");

    }

    console.log("Loading attendance from:", url);

    try {

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }

        records = await response.json();

        display(records);

    } catch (err) {

        console.error(
            "Error loading attendance:",
            err
        );

    }

}

// ==============================
// Display Table
// ==============================
function display(data) {

    const table = document.getElementById("attendanceTable");

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center;padding:20px;">
                No attendance records found.
            </td>
        </tr>
        `;

        return;
    }

    data.slice().reverse().forEach(record => {

       table.innerHTML += `
<tr>

    <td>${record.studentId || ""}</td>

    <td>${record.name || ""}</td>

    <td>${record.grade || ""}</td>

    <td>${record.section || ""}</td>

    <td>${record.date || ""}</td>

    <td>${record.time || ""}</td>

    <td>
        <span class="status ${record.status.toLowerCase()}">
            ${record.status}
        </span>

        ${
            record.status === "Excused" && record.reason
                ? `<br><small class="excuse-reason">${record.reason}</small>`
                : ""
        }
    </td>

    <td class="action-cell">

        <div class="action-buttons">

            <button
                class="btn-blue"
                onclick="editAttendance(
                    '${record._id}',
                    '${record.status}',
                    '${record.reason || ""}'
                )">

                <i class="fa-solid fa-pen"></i>
                Edit

            </button>

            <button
                class="btn-red"
                onclick="deleteAttendance('${record._id}')">

                <i class="fa-solid fa-trash"></i>
                Delete

            </button>

        </div>

    </td>

</tr>
`;
    });

}

// ==============================
// Search Student
// ==============================
document.getElementById("searchAttendance").addEventListener("keyup", (e) => {

    const text = e.target.value.toLowerCase();

    const filtered = records.filter(record =>

        (record.name || "").toLowerCase().includes(text) ||
        (record.studentId || "").toLowerCase().includes(text)

    );

    display(filtered);

});

// ==============================
// Filter Date
// ==============================
document.getElementById("filterDate").addEventListener("change", (e) => {

    if (e.target.value === "") {

        display(records);

        return;

    }

    // Convert YYYY-MM-DD to M/D/YYYY
    const d = new Date(e.target.value);

    const formattedDate =
        (d.getMonth() + 1) + "/" +
        d.getDate() + "/" +
        d.getFullYear();

    const filtered = records.filter(record =>

        record.date === formattedDate

    );

    display(filtered);

});

// ==============================
// OPEN EDIT MODAL
// ==============================
function editAttendance(id, status, reason = "") {

    document.getElementById("attendanceId").value = id;

    document.getElementById("editStatus").value = status;

    document.getElementById("editReason").value = reason;

    toggleReason();

    document.getElementById("editModal").style.display = "flex";

}

// ==============================
// SAVE STATUS
// ==============================
async function saveAttendance(){

    const id = document.getElementById("attendanceId").value;

    const status = document.getElementById("editStatus").value;

    const reason = document.getElementById("editReason").value;

    const response = await fetch(`${API}/attendance/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            status,
            reason
        })

    });

    const data = await response.json();

    if(data.success){

        closeModal();

        loadAttendance();

    }

}
// ==============================
// CLOSE MODAL
// ==============================
function closeModal(){

    document.getElementById("editModal").style.display="none";

}

function toggleReason(){

    const status = document.getElementById("editStatus").value;

    const reasonBox = document.getElementById("reasonContainer");

    if(status === "Excused"){

        reasonBox.style.display = "block";

    }else{

        reasonBox.style.display = "none";

        document.getElementById("editReason").value = "";

    }

}

// ==============================
// DELETE ATTENDANCE
// ==============================
async function deleteAttendance(id){

    if(!confirm("Delete this attendance record?")) return;

    try{

        const response = await fetch(`${API}/attendance/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if(data.success){

            alert("Attendance deleted.");

            loadAttendance();

        }else{

            alert(data.message);

        }

    }catch(err){

        console.error(err);

    }

}