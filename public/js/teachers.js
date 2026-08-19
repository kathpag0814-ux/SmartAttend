// ==========================================
// SMARTATTEND - TEACHER MANAGEMENT
// teachers.js
// ==========================================

const API = "/api/teachers";

let teachers = [];
let editId = null;


// ==========================================
// GRADE → SECTION LIST
// ==========================================

const sections = {

    "Grade 7": [
        "Luna (STE)",
        "Rizal (STE)",
        "Lopez Jaena",
        "Jacinto (SP-Arts)",
        "Bonifacio (SP-Sports)",
        "Aquino",
        "Aguinaldo",
        "Gomez",
        "Dagohoy",
        "Mabini",
        "Zamora"
    ],

    "Grade 8": [
        "Diamond (STE)",
        "Ruby (STE)",
        "Emerald",
        "Sapphire",
        "Amber",
        "Topaz",
        "Pearl",
        "Zircon",
        "Citrine",
        "Amethyst",
        "Jade",
        "Aquamarine"
    ],

    "Grade 9": [
        "Perseus (STEM)",
        "Pisces (STEM)",
        "Aries (SP-Arts)",
        "Leo (SP-Sports)",
        "Aquarius",
        "Capricorn",
        "Sagittarius",
        "Sphinx",
        "Virgo",
        "Andromeda",
        "Libra"
    ],

    "Grade 10": [
        "Fleming (STEM)",
        "Mendeleev (STEM)",
        "Darwin",
        "Newton",
        "Archimedes",
        "Aristotle",
        "Armstrong",
        "Dalton",
        "Edison",
        "Einstein",
        "Galileo"
    ],

    "Grade 11": [
        "Academic (STEM) Block A",
        "Academic (STEM) Block B",
        "Academic (STEM) Block C",
        "Academic (HUMSS) Block D",
        "Academic (HUMSS) Block E",
        "Academic (HUMSS) Block F",
        "Academic (ABM) Block G",
        "Academic (Arts and Sports) Block H",
        "Tech Pro Block A",
        "Tech Pro Block B",
        "Tech Pro Block C",
        "Tech Pro Block D",
        "TechPro (Construction Operation and Carpentry) Block E",
        "ALS"
    ],

    "Grade 12": [
        "ABM B",
        "STEM D",
        "STEM E",
        "STEM F",
        "HUMSS D",
        "HUMSS E",
        "HUMSS F",
        "ICT C",
        "ICT D",
        "Arts/Sports",
        "TVL-HE B",
        "Carpentry/Tilesetting",
        "EIM B",
        "ALS"
    ]

};


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("SmartAttend Teacher Management loaded.");

    const gradeSelect = document.getElementById("grade");
    const searchInput = document.getElementById("searchTeacher");

    // Grade → Section
    if (gradeSelect) {

        gradeSelect.addEventListener("change", function () {

            loadSections();

        });

    }

    // Search
    if (searchInput) {

        searchInput.addEventListener("input", function () {

            searchTeachers();

        });

    }

    // Load teachers
    loadTeachers();

});


// ==========================================
// LOAD SECTIONS
// ==========================================

function loadSections(selectedSection = "") {

    const gradeSelect = document.getElementById("grade");
    const sectionSelect = document.getElementById("section");

    if (!gradeSelect || !sectionSelect) {

        console.error("Grade or section element not found.");

        return;

    }

    const selectedGrade = gradeSelect.value;

    // Clear section dropdown
    sectionSelect.innerHTML = "";

    // Default option
    const defaultOption = document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent = "Select Section";

    sectionSelect.appendChild(defaultOption);

    // No grade selected
    if (!selectedGrade) {

        return;

    }

    // Get section list
    const sectionList = sections[selectedGrade] || [];

    // Add sections
    sectionList.forEach(function (sectionName) {

        const option = document.createElement("option");

        option.value = sectionName;
        option.textContent = sectionName;

        sectionSelect.appendChild(option);

    });

    // Restore section when editing
    if (selectedSection) {

        if (sectionList.includes(selectedSection)) {

            sectionSelect.value = selectedSection;

        }

    }

    console.log(
        "Sections loaded:",
        selectedGrade,
        sectionList
    );

}


// ==========================================
// LOAD TEACHERS
// ==========================================

async function loadTeachers() {

    const table = document.getElementById("teacherTable");

    try {

        const response = await fetch(API);

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }

        const data = await response.json();

        console.log("Teacher data:", data);

        // Backend can return:
        // []
        // OR
        // { teachers: [] }

        if (Array.isArray(data)) {

            teachers = data;

        } else if (
            data &&
            Array.isArray(data.teachers)
        ) {

            teachers = data.teachers;

        } else {

            teachers = [];

        }

        displayTeachers();

    }

    catch (error) {

        console.error(
            "Load teachers error:",
            error
        );

        teachers = [];

        if (table) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:25px;
                        "
                    >
                        Unable to load teachers.
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// DISPLAY TEACHERS
// ==========================================

function displayTeachers(teacherList = teachers) {

    const table = document.getElementById("teacherTable");

    if (!table) {

        console.error("#teacherTable not found.");

        return;

    }

    table.innerHTML = "";

    // No teachers
    if (
        !Array.isArray(teacherList) ||
        teacherList.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No teachers registered.
                </td>
            </tr>
        `;

        return;

    }

    teacherList.forEach(function (teacher) {

        const id =
            teacher._id ||
            teacher.id ||
            "";

        const fullName =
            teacher.fullName ||
            teacher.name ||
            "Unknown";

        const username =
            teacher.username ||
            "";

        const grade =
            teacher.grade ||
            teacher.assignedGrade ||
            "";

        const section =
            teacher.section ||
            teacher.assignedSection ||
            "";

        const adviser =
            teacher.adviser === true ||
            teacher.adviser === "true";

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHTML(fullName)}
            </td>

            <td>
                ${escapeHTML(username)}
            </td>

            <td>
                ${escapeHTML(grade)}
            </td>

            <td>
                ${escapeHTML(section)}
            </td>

            <td>
                ${
                    adviser
                        ? "✔ Adviser"
                        : "-"
                }
            </td>

            <td class="action-cell">

                <div class="action-buttons">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editTeacher('${escapeAttribute(id)}')"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteTeacher('${escapeAttribute(id)}')"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>

                </div>

            </td>
        `;

        table.appendChild(row);

    });

}


// ==========================================
// ADD / UPDATE TEACHER
// ==========================================

async function addTeacher() {

    const fullName =
        document.getElementById("fullName")?.value.trim();

    const username =
        document.getElementById("username")?.value.trim();

    const password =
        document.getElementById("teacherPassword")?.value;

    const grade =
        document.getElementById("grade")?.value;

    const section =
        document.getElementById("section")?.value;


    // ======================================
    // VALIDATION
    // ======================================

    if (!fullName) {

        alert("Please enter the teacher name.");

        return;

    }

    if (!username) {

        alert("Please enter a username.");

        return;

    }

    if (!grade) {

        alert("Please select a grade.");

        return;

    }

    if (!section) {

        alert("Please select a section.");

        return;

    }

    // Password required for new teacher
    if (!editId && !password) {

        alert("Please enter a password.");

        return;

    }


    // ======================================
    // TEACHER DATA
    // ======================================

    const teacherData = {

        fullName: fullName,
        username: username,
        grade: grade,
        section: section

    };

    // Password only if entered
    if (password) {

        teacherData.password = password;

    }


    // ======================================
    // URL + METHOD
    // ======================================

    let url = API;
    let method = "POST";

    if (editId) {

        url =
            `${API}/${encodeURIComponent(editId)}`;

        method = "PUT";

    }


    console.log(
        "Saving teacher:",
        teacherData
    );


    // ======================================
    // SEND REQUEST
    // ======================================

    try {

        const response =
            await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body:
                    JSON.stringify(teacherData)

            });


        const data =
            await response.json();


        console.log(
            "Save response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                `Server returned ${response.status}`
            );

        }


        if (data.success === false) {

            throw new Error(
                data.message ||
                "Unable to save teacher."
            );

        }


        alert(
            editId
                ? "Teacher updated successfully."
                : "Teacher registered successfully."
        );


        // Reset edit mode
        editId = null;

        clearForm();

        // Reload
        await loadTeachers();

    }

    catch (error) {

        console.error(
            "Teacher save error:",
            error
        );

        alert(
            error.message ||
            "Unable to connect to the server."
        );

    }

}


// ==========================================
// DELETE TEACHER
// ==========================================

async function deleteTeacher(id) {

    if (!id) {

        alert("Teacher ID is missing.");

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this teacher?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        console.log(
            "Delete response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                `Server returned ${response.status}`
            );

        }


        if (data.success === false) {

            throw new Error(
                data.message ||
                "Unable to delete teacher."
            );

        }


        alert(
            "Teacher deleted successfully."
        );


        // Reload teachers
        await loadTeachers();

    }

    catch (error) {

        console.error(
            "Delete teacher error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete teacher."
        );

    }

}


// ==========================================
// EDIT TEACHER
// ==========================================

function editTeacher(id) {

    if (!id) {

        alert("Teacher ID is missing.");

        return;

    }


    // Find teacher
    const teacher =
        teachers.find(function (item) {

            const teacherId =
                item._id ||
                item.id ||
                "";

            return String(teacherId) === String(id);

        });


    if (!teacher) {

        alert("Teacher not found.");

        return;

    }


    // ======================================
    // SAVE EDIT ID
    // ======================================

    editId =
        teacher._id ||
        teacher.id;


    // ======================================
    // FORM ELEMENTS
    // ======================================

    const fullName =
        document.getElementById("fullName");

    const username =
        document.getElementById("username");

    const password =
        document.getElementById("teacherPassword");

    const grade =
        document.getElementById("grade");

    const section =
        document.getElementById("section");


    // ======================================
    // FILL FORM
    // ======================================

    if (fullName) {

        fullName.value =
            teacher.fullName ||
            teacher.name ||
            "";

    }


    if (username) {

        username.value =
            teacher.username ||
            "";

    }


    // Password stays empty
    // because password is optional during update

    if (password) {

        password.value = "";

    }


    const teacherGrade =
        teacher.grade ||
        teacher.assignedGrade ||
        "";

    const teacherSection =
        teacher.section ||
        teacher.assignedSection ||
        "";


    // Set grade
    if (grade) {

        grade.value =
            teacherGrade;

    }


    // Load correct sections
    loadSections(
        teacherSection
    );


    // ======================================
    // CHANGE BUTTON
    // ======================================

    const createButton =
        document.querySelector(
            'button[onclick="addTeacher()"]'
        );


    if (createButton) {

        createButton.innerHTML = `
            <i class="fa-solid fa-pen"></i>
            Update Teacher
        `;

    }


    // ======================================
    // SCROLL TO FORM
    // ======================================

    if (fullName) {

        fullName.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        fullName.focus();

    }

}


// ==========================================
// SEARCH TEACHERS
// ==========================================

function searchTeachers() {

    const searchInput =
        document.getElementById(
            "searchTeacher"
        );


    if (!searchInput) {

        return;

    }


    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();


    // Show all
    if (!keyword) {

        displayTeachers();

        return;

    }


    // Filter
    const filtered =
        teachers.filter(
            function (teacher) {

                const fullName =
                    String(
                        teacher.fullName ||
                        teacher.name ||
                        ""
                    ).toLowerCase();


                const username =
                    String(
                        teacher.username ||
                        ""
                    ).toLowerCase();


                const grade =
                    String(
                        teacher.grade ||
                        teacher.assignedGrade ||
                        ""
                    ).toLowerCase();


                const section =
                    String(
                        teacher.section ||
                        teacher.assignedSection ||
                        ""
                    ).toLowerCase();


                return (

                    fullName.includes(keyword) ||

                    username.includes(keyword) ||

                    grade.includes(keyword) ||

                    section.includes(keyword)

                );

            }
        );


    displayTeachers(
        filtered
    );

}


// ==========================================
// CLEAR FORM
// ==========================================

function clearForm() {

    const fullName =
        document.getElementById(
            "fullName"
        );

    const username =
        document.getElementById(
            "username"
        );

    const password =
        document.getElementById(
            "teacherPassword"
        );

    const grade =
        document.getElementById(
            "grade"
        );

    const section =
        document.getElementById(
            "section"
        );


    if (fullName) {

        fullName.value = "";

    }


    if (username) {

        username.value = "";

    }


    if (password) {

        password.value = "";

        password.type = "password";

    }


    if (grade) {

        grade.value = "";

    }


    if (section) {

        section.innerHTML = `
            <option value="">
                Select Section
            </option>
        `;

    }


    // Reset edit mode
    editId = null;


    // Reset password eye
    const icon =
        document.getElementById(
            "togglePassword"
        );


    if (icon) {

        icon.classList.remove(
            "fa-eye-slash"
        );

        icon.classList.add(
            "fa-eye"
        );

    }


    // Reset button
    const createButton =
        document.querySelector(
            'button[onclick="addTeacher()"]'
        );


    if (createButton) {

        createButton.innerHTML = `
            <i class="fa-solid fa-plus"></i>
            Create Teacher
        `;

    }

}


// ==========================================
// TOGGLE PASSWORD
// ==========================================

function togglePassword() {

    const password =
        document.getElementById(
            "teacherPassword"
        );

    const icon =
        document.getElementById(
            "togglePassword"
        );


    if (!password) {

        return;

    }


    if (password.type === "password") {

        password.type = "text";


        if (icon) {

            icon.classList.remove(
                "fa-eye"
            );

            icon.classList.add(
                "fa-eye-slash"
            );

        }

    }

    else {

        password.type = "password";


        if (icon) {

            icon.classList.remove(
                "fa-eye-slash"
            );

            icon.classList.add(
                "fa-eye"
            );

        }

    }

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// ATTRIBUTE ESCAPE
// ==========================================

function escapeAttribute(value) {

    return String(value ?? "")
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}


// ==========================================
// CANCEL EDIT
// ==========================================

function cancelEdit() {

    clearForm();

}