// ==========================================
// SMARTATTEND - REGISTRATION.JS
// Student Registration
// ==========================================

"use strict";

// ==========================================
// API
// ==========================================

const API = "/api";

// ==========================================
// LOGGED-IN USER
// ==========================================

const currentRole =
    (localStorage.getItem("role") || "")
        .trim()
        .toLowerCase();

const rawTeacherGrade =
    (localStorage.getItem("grade") || "")
        .trim();

const rawTeacherSection =
    (localStorage.getItem("section") || "")
        .trim();

const teacherName =
    (localStorage.getItem("fullName") || "")
        .trim();

const token =
    localStorage.getItem("token") || "";


// ==========================================
// NORMALIZE GRADE
// ==========================================

function normalizeGrade(value) {

    const grade =
        String(value || "")
            .trim();

    if (!grade) {
        return "";
    }

    const match =
        grade.match(/(\d+)/);

    if (match) {
        return `Grade ${match[1]}`;
    }

    return grade;
}


// ==========================================
// NORMALIZE SECTION
// ==========================================

function normalizeSection(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

}


// ==========================================
// TEACHER ASSIGNMENT
// ==========================================

const teacherGrade =
    normalizeGrade(rawTeacherGrade);

const teacherSection =
    rawTeacherSection;

const teacherSectionNormalized =
    normalizeSection(teacherSection);


// ==========================================
// DEBUG
// ==========================================

console.log("====================================");
console.log("SMARTATTEND REGISTRATION");
console.log("====================================");
console.log("Role:", currentRole);
console.log("Teacher:", teacherName);
console.log("Raw Grade:", rawTeacherGrade);
console.log("Normalized Grade:", teacherGrade);
console.log("Raw Section:", rawTeacherSection);
console.log(
    "Normalized Section:",
    teacherSectionNormalized
);
console.log("Token exists:", !!token);
console.log("API:", API);
console.log("====================================");


// ==========================================
// SECTION DATABASE
// ==========================================

const SECTIONS = {

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
// GLOBAL VARIABLES
// ==========================================

let selectedPhoto = "";
let allStudents = [];


// ==========================================
// GET ELEMENT
// ==========================================

function getElement(id) {

    return document.getElementById(id);

}


// ==========================================
// CHECK TEACHER
// ==========================================

function isTeacher() {

    return currentRole === "teacher";

}


// ==========================================
// TEACHER ASSIGNMENT EXISTS
// ==========================================

function hasTeacherAssignment() {

    return (
        isTeacher() &&
        teacherGrade !== "" &&
        teacherSection !== ""
    );

}


// ==========================================
// CHECK STUDENT BELONGS TO TEACHER
// ==========================================

function studentBelongsToTeacher(student) {

    if (!isTeacher()) {
        return true;
    }

    const studentGrade =
        normalizeGrade(
            student.grade ||
            student.gradeLevel ||
            ""
        );

    const studentSection =
        normalizeSection(
            student.section ||
            student.sectionName ||
            ""
        );

    return (
        studentGrade === teacherGrade &&
        studentSection ===
            teacherSectionNormalized
    );

}


// ==========================================
// LOAD REGISTRATION SECTIONS
// ==========================================

function loadSections() {

    const gradeSelect =
        getElement("grade");

    const sectionSelect =
        getElement("section");


    if (!gradeSelect || !sectionSelect) {

        console.error(
            "Grade or Section element not found."
        );

        return;

    }


    // ======================================
    // IMPORTANT:
    // DO NOT DISABLE DROPDOWNS
    // ======================================

    gradeSelect.disabled = false;
    sectionSelect.disabled = false;


    const selectedGrade =
        normalizeGrade(
            gradeSelect.value
        );


    // ======================================
    // CLEAR SECTION
    // ======================================

    sectionSelect.innerHTML = "";


    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        selectedGrade
            ? "Select Section"
            : "Select Grade First";

    sectionSelect.appendChild(
        defaultOption
    );


    // ======================================
    // NO GRADE
    // ======================================

    if (!selectedGrade) {

        return;

    }


    // ======================================
    // GET SECTIONS
    // ======================================

    const gradeSections =
        SECTIONS[selectedGrade] || [];


    gradeSections.forEach(
        function(sectionName) {

            const option =
                document.createElement("option");

            option.value =
                sectionName;

            option.textContent =
                sectionName;

            sectionSelect.appendChild(
                option
            );

        }
    );


    // ======================================
    // TEACHER
    // ======================================

    if (
        isTeacher() &&
        teacherGrade &&
        teacherSection
    ) {

        if (
            selectedGrade ===
            teacherGrade
        ) {

            const matchingOption =
                Array.from(
                    sectionSelect.options
                ).find(
                    option =>
                        normalizeSection(
                            option.value
                        ) ===
                        teacherSectionNormalized
                );

            if (matchingOption) {

                sectionSelect.value =
                    matchingOption.value;

            }

        }

    }

}


// ==========================================
// LOAD FILTER SECTIONS
// ==========================================

function loadSectionFilter() {

    const gradeFilter =
        getElement("gradeFilter");

    const sectionFilter =
        getElement("sectionFilter");


    if (
        !gradeFilter ||
        !sectionFilter
    ) {

        return;

    }


    // ======================================
    // DO NOT DISABLE FOR TEACHERS
    // ======================================

    gradeFilter.disabled = false;
    sectionFilter.disabled = false;


    const selectedGrade =
        normalizeGrade(
            gradeFilter.value
        );


    // ======================================
    // CLEAR
    // ======================================

    sectionFilter.innerHTML = "";


    const allOption =
        document.createElement("option");

    allOption.value = "";

    allOption.textContent =
        "All Sections";

    sectionFilter.appendChild(
        allOption
    );


    if (!selectedGrade) {

        return;

    }


    const sections =
        SECTIONS[selectedGrade] || [];


    sections.forEach(
        function(sectionName) {

            const option =
                document.createElement("option");

            option.value =
                sectionName;

            option.textContent =
                sectionName;

            sectionFilter.appendChild(
                option
            );

        }
    );


    // ======================================
    // TEACHER DEFAULT
    // ======================================

    if (
        isTeacher() &&
        selectedGrade === teacherGrade
    ) {

        const matchingOption =
            Array.from(
                sectionFilter.options
            ).find(
                option =>
                    normalizeSection(
                        option.value
                    ) ===
                    teacherSectionNormalized
            );

        if (matchingOption) {

            sectionFilter.value =
                matchingOption.value;

        }

    }

}


// ==========================================
// PHOTO UPLOAD
// ==========================================

function setupPhotoUpload() {

    const photoInput =
        getElement("profilePic");

    const fileName =
        getElement("profileFileName");


    if (!photoInput) {

        console.warn(
            "profilePic element not found."
        );

        return;

    }


    photoInput.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                selectedPhoto = "";

                if (fileName) {

                    fileName.textContent =
                        "No photo selected";

                }

                removePhotoPreview();

                return;

            }


            // ==================================
            // IMAGE TYPE
            // ==================================

            if (
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select an image file."
                );

                this.value = "";

                selectedPhoto = "";

                return;

            }


            // ==================================
            // IMAGE SIZE
            // ==================================

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Photo must be smaller than 5MB."
                );

                this.value = "";

                selectedPhoto = "";

                return;

            }


            if (fileName) {

                fileName.textContent =
                    file.name;

            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    selectedPhoto =
                        event.target.result;

                    showPhotoPreview(
                        selectedPhoto
                    );

                };


            reader.onerror =
                function() {

                    console.error(
                        "Unable to read photo."
                    );

                    alert(
                        "Unable to read the selected photo."
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// ==========================================
// SHOW PHOTO PREVIEW
// ==========================================

function showPhotoPreview(src) {

    const container =
        getElement(
            "photoPreviewContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const img =
        document.createElement("img");


    img.id =
        "photoPreview";

    img.src =
        src;

    img.alt =
        "Student Photo";


    img.style.width =
        "90px";

    img.style.height =
        "90px";

    img.style.objectFit =
        "cover";

    img.style.borderRadius =
        "50%";

    img.style.display =
        "block";

    img.style.margin =
        "10px auto";


    container.appendChild(img);

}


// ==========================================
// REMOVE PHOTO PREVIEW
// ==========================================

function removePhotoPreview() {

    const preview =
        getElement(
            "photoPreview"
        );


    if (preview) {

        preview.remove();

    }

}


// ==========================================
// SAVE STUDENT
// ==========================================

async function saveStudent() {

    console.log(
        "===================================="
    );

    console.log(
        "SAVE STUDENT CLICKED"
    );

    console.log(
        "===================================="
    );


    const studentIdInput =
        getElement("studentId");

    const nameInput =
        getElement("name");

    const gradeInput =
        getElement("grade");

    const sectionInput =
        getElement("section");

    const saveButton =
        getElement("saveStudentBtn");


    // ======================================
    // CHECK ELEMENTS
    // ======================================

    if (!studentIdInput) {

        alert(
            "LRN input was not found."
        );

        return;

    }

    if (!nameInput) {

        alert(
            "Student name input was not found."
        );

        return;

    }

    if (!gradeInput) {

        alert(
            "Grade dropdown was not found."
        );

        return;

    }

    if (!sectionInput) {

        alert(
            "Section dropdown was not found."
        );

        return;

    }


    // ======================================
    // VALUES
    // ======================================

    const studentId =
        studentIdInput.value.trim();

    const name =
        nameInput.value.trim();

    let grade =
        normalizeGrade(
            gradeInput.value
        );

    let section =
        sectionInput.value.trim();


    // ======================================
    // TEACHER SECURITY
    // ======================================

    if (isTeacher()) {

        if (!hasTeacherAssignment()) {

            alert(
                "Your teacher account has no assigned grade and section. Please contact the administrator."
            );

            return;

        }


        // IMPORTANT:
        // Teacher may click/select,
        // but registration is restricted.

        if (
            normalizeGrade(grade) !==
            teacherGrade
        ) {

            alert(
                `You can only register students in ${teacherGrade}.`
            );

            gradeInput.value =
                teacherGrade;

            loadSections();

            return;

        }


        if (
            normalizeSection(section) !==
            teacherSectionNormalized
        ) {

            alert(
                `You can only register students in ${teacherSection}.`
            );

            sectionInput.value =
                teacherSection;

            return;

        }

    }


    // ======================================
    // VALIDATION
    // ======================================

    if (!studentId) {

        alert(
            "Please enter the student's LRN."
        );

        studentIdInput.focus();

        return;

    }


    if (!name) {

        alert(
            "Please enter the student's full name."
        );

        nameInput.focus();

        return;

    }


    if (!grade) {

        alert(
            "Please select a grade."
        );

        gradeInput.focus();

        return;

    }


    if (!section) {

        alert(
            "Please select a section."
        );

        sectionInput.focus();

        return;

    }


    // ======================================
    // DATA
    // ======================================

    const studentData = {

        studentId:
            studentId,

        name:
            name,

        grade:
            grade,

        section:
            section,

        photo:
            selectedPhoto || "",

        status:
            "Active"

    };


    console.log(
        "FINAL STUDENT DATA:",
        studentData
    );


    // ======================================
    // BUTTON
    // ======================================

    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';

    }


    try {

        // ==================================
        // POST
        // ==================================

        const response =
            await fetch(
                `${API}/students`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        ...(token
                            ? {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                            : {})

                    },

                    body:
                        JSON.stringify(
                            studentData
                        )

                }
            );


        console.log(
            "Server status:",
            response.status
        );


        const data =
            await response
                .json()
                .catch(
                    () => ({})
                );


        console.log(
            "Registration response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                `Server returned ${response.status}`
            );

        }


        if (
            data.success === false
        ) {

            throw new Error(
                data.message ||
                "Registration failed."
            );

        }


        // ==================================
        // REGISTERED STUDENT
        // ==================================

        const student =
            data.student ||
            data.data ||
            data;


        const registeredStudent = {

            studentId:
                student.studentId ||
                studentData.studentId,

            name:
                student.name ||
                studentData.name,

            grade:
                student.grade ||
                studentData.grade,

            section:
                student.section ||
                studentData.section,

            photo:
                student.photo ||
                student.profilePic ||
                student.profilePhoto ||
                studentData.photo ||
                "",

            status:
                student.status ||
                "Active"

        };


        console.log(
            "Registered student:",
            registeredStudent
        );


        // ==================================
        // SHOW QR
        // ==================================

        showQRModal(
            registeredStudent
        );


        // ==================================
        // CLEAR
        // ==================================

        clearRegistrationForm();


        // ==================================
        // RELOAD
        // ==================================

        await loadStudents();


    }
    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        alert(
            "Unable to register student.\n\n" +
            error.message
        );

    }
    finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.innerHTML =
                '<i class="fa-solid fa-user-plus"></i> Register Student';

        }

    }

}


// ==========================================
// REGISTER STUDENT
// ==========================================

function registerStudent(event) {

    if (event) {

        event.preventDefault();

    }

    return saveStudent();

}


// ==========================================
// CLEAR FORM
// ==========================================

function clearRegistrationForm() {

    const studentId =
        getElement("studentId");

    const name =
        getElement("name");

    const grade =
        getElement("grade");

    const section =
        getElement("section");

    const photo =
        getElement("profilePic");

    const fileName =
        getElement("profileFileName");


    if (studentId) {

        studentId.value = "";

    }


    if (name) {

        name.value = "";

    }


    if (photo) {

        photo.value = "";

    }


    if (fileName) {

        fileName.textContent =
            "No photo selected";

    }


    selectedPhoto = "";

    removePhotoPreview();


    // ======================================
    // RESET GRADE
    // ======================================

    if (grade) {

        grade.value = "";

    }


    // ======================================
    // RESET SECTION
    // ======================================

    if (section) {

        section.innerHTML =
            '<option value="">Select Grade First</option>';

        section.value = "";

    }


    // ======================================
    // IMPORTANT:
    // KEEP DROPDOWNS ENABLED
    // ======================================

    if (grade) {

        grade.disabled = false;

    }

    if (section) {

        section.disabled = false;

    }

}


// ==========================================
// LOAD STUDENTS
// ==========================================

async function loadStudents() {

    const table =
        getElement("studentTable");


    if (!table) {

        return;

    }


    try {

        console.log(
            "Loading students..."
        );


        const response =
            await fetch(
                `${API}/students`,
                {
                    headers: {

                        ...(token
                            ? {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                            : {})

                    }

                }
            );


        console.log(
            "Students HTTP status:",
            response.status
        );


        const data =
            await response
                .json()
                .catch(
                    () => ({})
                );


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                `Server returned ${response.status}`
            );

        }


        let students = [];


        if (
            Array.isArray(data)
        ) {

            students = data;

        }
        else if (
            Array.isArray(
                data.students
            )
        ) {

            students =
                data.students;

        }
        else if (
            Array.isArray(
                data.data
            )
        ) {

            students =
                data.data;

        }


        console.log(
            "Students received:",
            students.length
        );


        allStudents =
            students;


        // ==================================
        // TEACHER FILTER
        // ==================================

        if (isTeacher()) {

            students =
                students.filter(
                    student =>
                        studentBelongsToTeacher(
                            student
                        )
                );

        }


        // ==================================
        // HEADER FILTERS
        // ==================================

        const search =
            getElement("search");

        const gradeFilter =
            getElement("gradeFilter");

        const sectionFilter =
            getElement("sectionFilter");

        const statusFilter =
            getElement("statusFilter");


        const searchValue =
            search
                ? search.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedGrade =
            gradeFilter
                ? normalizeGrade(
                    gradeFilter.value
                )
                : "";


        const selectedSection =
            sectionFilter
                ? normalizeSection(
                    sectionFilter.value
                )
                : "";


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "Active";


        // ==================================
        // APPLY FILTERS
        // ==================================

        students =
            students.filter(
                function(student) {

                    const name =
                        String(
                            student.name ||
                            student.studentName ||
                            ""
                        )
                            .toLowerCase();

                    const id =
                        String(
                            student.studentId ||
                            student.lrn ||
                            ""
                        )
                            .toLowerCase();

                    const grade =
                        normalizeGrade(
                            student.grade ||
                            student.gradeLevel ||
                            ""
                        );

                    const section =
                        normalizeSection(
                            student.section ||
                            student.sectionName ||
                            ""
                        );

                    const status =
                        String(
                            student.status ||
                            "Active"
                        )
                            .toLowerCase();


                    // Search

                    if (
                        searchValue &&
                        !name.includes(
                            searchValue
                        ) &&
                        !id.includes(
                            searchValue
                        )
                    ) {

                        return false;

                    }


                    // Grade

                    if (
                        selectedGrade &&
                        grade !== selectedGrade
                    ) {

                        return false;

                    }


                    // Section

                    if (
                        selectedSection &&
                        section !==
                        selectedSection
                    ) {

                        return false;

                    }


                    // Status

                    if (
                        selectedStatus !==
                        "All" &&
                        status !==
                        selectedStatus.toLowerCase()
                    ) {

                        return false;

                    }


                    return true;

                }
            );


        displayStudents(
            students
        );


        updateStudentStats(
            students
        );


    }
    catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#b91c1c;
                    "
                >

                    Unable to load students.

                    <br>

                    <small>
                        ${escapeHTML(
                            error.message
                        )}
                    </small>

                </td>

            </tr>

        `;

    }

}


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents(students) {

    const table =
        getElement("studentTable");


    if (!table) {

        return;

    }


    table.innerHTML = "";


    if (
        !Array.isArray(students) ||
        students.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    ${
                        isTeacher()
                            ? `
                                No students found in
                                ${escapeHTML(
                                    teacherGrade
                                )}
                                -
                                ${escapeHTML(
                                    teacherSection
                                )}.
                              `
                            : `
                                No registered students found.
                              `
                    }

                </td>

            </tr>

        `;

        return;

    }


    students.forEach(
        function(student) {

            const studentId =
                student.studentId ||
                student.lrn ||
                student.LRN ||
                "";

            const name =
                student.name ||
                student.studentName ||
                "Unknown";

            const grade =
                normalizeGrade(
                    student.grade ||
                    student.gradeLevel ||
                    ""
                );

            const section =
                student.section ||
                student.sectionName ||
                "";

            const photo =
                student.photo ||
                student.profilePic ||
                student.profilePhoto ||
                student.photoUrl ||
                "";

            const status =
                student.status ||
                "Active";

            const databaseId =
                student._id ||
                student.id ||
                studentId;


            const row =
                document.createElement(
                    "tr"
                );


            // ==================================
            // PHOTO
            // ==================================

            let photoHTML = "";


            if (photo) {

                photoHTML = `

                    <img
                        src="${escapeHTML(photo)}"
                        alt="Student"
                        style="
                            width:45px;
                            height:45px;
                            object-fit:cover;
                            border-radius:50%;
                        "
                        onerror="
                            this.style.display='none';
                        "
                    >

                `;

            }
            else {

                photoHTML = `

                    <div
                        style="
                            width:45px;
                            height:45px;
                            border-radius:50%;
                            background:#e5e7eb;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:18px;
                        "
                    >

                        <i
                            class="fa-solid fa-user"
                        ></i>

                    </div>

                `;

            }


            // ==================================
            // ROW
            // ==================================

            row.innerHTML = `

                <td>
                    ${escapeHTML(studentId)}
                </td>

                <td>

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                        "
                    >

                        ${photoHTML}

                        <span>
                            ${escapeHTML(name)}
                        </span>

                    </div>

                </td>

                <td>
                    ${escapeHTML(grade)}
                </td>

                <td>
                    ${escapeHTML(section)}
                </td>

                <td>

                    <div
                        class="qr-placeholder"
                        data-student-id="${escapeHTML(studentId)}"
                        data-student-name="${escapeHTML(name)}"
                        data-student-grade="${escapeHTML(grade)}"
                        data-student-section="${escapeHTML(section)}"
                        style="
                            width:90px;
                            height:90px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            margin:auto;
                            cursor:pointer;
                        "
                        title="Click to view QR Code"
                    >

                        Loading...

                    </div>

                </td>

                <td>

                    <span
                        style="
                            padding:5px 10px;
                            border-radius:20px;
                            background:#dcfce7;
                            color:#166534;
                        "
                    >

                        ${escapeHTML(status)}

                    </span>

                </td>

                <td>

                    <button
                        type="button"
                        class="delete-student-btn"
                        data-id="${escapeHTML(databaseId)}"
                        style="
                            border:none;
                            background:#dc2626;
                            color:white;
                            padding:8px 12px;
                            border-radius:6px;
                            cursor:pointer;
                        "
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(row);


            // ==================================
            // DELETE
            // ==================================

            const deleteButton =
                row.querySelector(
                    ".delete-student-btn"
                );


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function() {

                        deleteStudent(
                            this.dataset.id
                        );

                    }
                );

            }

        }
    );


    generateQRCodes();

}


// ==========================================
// GENERATE QR CODES
// ==========================================

function generateQRCodes() {

    if (
        typeof QRCode ===
        "undefined"
    ) {

        console.error(
            "QRCode library is not loaded."
        );

        return;

    }


    const qrElements =
        document.querySelectorAll(
            ".qr-placeholder"
        );


    qrElements.forEach(
        function(element) {

            const studentId =
                element.dataset.studentId;


            if (!studentId) {

                element.innerHTML =
                    "<small>No LRN</small>";

                return;

            }


            element.innerHTML = "";


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.style.width =
                "80px";

            canvas.style.height =
                "80px";

            canvas.style.cursor =
                "pointer";


            element.appendChild(
                canvas
            );


            QRCode.toCanvas(
                canvas,
                studentId,
                {
                    width: 150,
                    height: 150,
                    margin: 1,
                    errorCorrectionLevel: "M"
                },
                function(error) {

                    if (error) {

                        console.error(
                            "QR generation error:",
                            error
                        );

                        element.innerHTML =
                            "QR Error";

                        return;

                    }


                    element.onclick =
                        function() {

                            showLargeQRCode(
                                studentId,
                                element.dataset.studentName,
                                element.dataset.studentGrade,
                                element.dataset.studentSection
                            );

                        };

                }
            );

        }
    );

}


// ==========================================
// SHOW LARGE QR CODE
// ==========================================

function showLargeQRCode(
    studentId,
    studentName = "",
    studentGrade = "",
    studentSection = ""
) {

    const oldModal =
        getElement(
            "tableQRModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "tableQRModal";


    modal.style.position =
        "fixed";

    modal.style.inset =
        "0";

    modal.style.background =
        "rgba(0,0,0,.65)";

    modal.style.display =
        "flex";

    modal.style.alignItems =
        "center";

    modal.style.justifyContent =
        "center";

    modal.style.zIndex =
        "99999";

    modal.style.padding =
        "20px";


    modal.innerHTML = `

        <div
            style="
                position:relative;
                width:380px;
                max-width:95%;
                background:white;
                border-radius:20px;
                padding:30px;
                text-align:center;
                box-shadow:0 20px 60px rgba(0,0,0,.3);
            "
        >

            <button
                id="closeTableQR"
                type="button"
                style="
                    position:absolute;
                    top:12px;
                    right:15px;
                    border:none;
                    background:none;
                    font-size:28px;
                    cursor:pointer;
                "
            >
                &times;
            </button>

            <h2>
                <i
                    class="fa-solid fa-qrcode"
                ></i>

                Student QR Code
            </h2>

            <div
                id="largeTableQR"
                style="
                    display:flex;
                    justify-content:center;
                    margin:20px auto;
                "
            ></div>

            <h3>
                ${escapeHTML(studentName)}
            </h3>

            <p>
                <strong>LRN:</strong>
                ${escapeHTML(studentId)}
            </p>

            <p>
                <strong>Grade:</strong>
                ${escapeHTML(studentGrade)}
            </p>

            <p>
                <strong>Section:</strong>
                ${escapeHTML(studentSection)}
            </p>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const qrContainer =
        getElement(
            "largeTableQR"
        );


    if (
        qrContainer &&
        typeof QRCode !==
            "undefined"
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );


        qrContainer.appendChild(
            canvas
        );


        QRCode.toCanvas(
            canvas,
            studentId,
            {
                width: 240,
                height: 240,
                margin: 2,
                errorCorrectionLevel: "M"
            },
            function(error) {

                if (error) {

                    console.error(
                        "Large QR error:",
                        error
                    );

                }

            }
        );

    }


    const closeButton =
        getElement(
            "closeTableQR"
        );


    if (closeButton) {

        closeButton.onclick =
            function() {

                modal.remove();

            };

    }


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                modal
            ) {

                modal.remove();

            }

        }
    );

}


// ==========================================
// SHOW REGISTRATION QR MODAL
// ==========================================

function showQRModal(student) {

    const modal =
        getElement(
            "qrModal"
        );


    if (!modal) {

        createRegistrationQRModal(
            student
        );

        return;

    }


    const qrContainer =
        getElement(
            "bigQRCode"
        );

    const studentInfo =
        getElement(
            "studentInfo"
        );

    const profilePreview =
        getElement(
            "profilePreview"
        );


    const studentId =
        student?.studentId || "";

    const name =
        student?.name || "";

    const grade =
        student?.grade || "";

    const section =
        student?.section || "";

    const photo =
        student?.photo || "";


    // ======================================
    // QR
    // ======================================

    if (qrContainer) {

        qrContainer.innerHTML = "";


        const canvas =
            document.createElement(
                "canvas"
            );


        qrContainer.appendChild(
            canvas
        );


        if (
            typeof QRCode !==
                "undefined" &&
            studentId
        ) {

            QRCode.toCanvas(
                canvas,
                studentId,
                {
                    width: 220,
                    height: 220,
                    margin: 2
                },
                function(error) {

                    if (error) {

                        console.error(
                            "Registration QR error:",
                            error
                        );

                    }

                }
            );

        }

    }


    // ======================================
    // PHOTO
    // ======================================

    if (profilePreview) {

        if (photo) {

            profilePreview.src =
                photo;

            profilePreview.style.display =
                "block";

        }
        else {

            profilePreview.removeAttribute(
                "src"
            );

            profilePreview.style.display =
                "none";

        }

    }


    // ======================================
    // INFORMATION
    // ======================================

    if (studentInfo) {

        studentInfo.innerHTML = `

            <h2>
                ${escapeHTML(name)}
            </h2>

            <p>
                <strong>LRN:</strong>
                ${escapeHTML(studentId)}
            </p>

            <p>
                <strong>Grade:</strong>
                ${escapeHTML(grade)}
            </p>

            <p>
                <strong>Section:</strong>
                ${escapeHTML(section)}
            </p>

        `;

    }


    modal.style.display =
        "flex";

}


// ==========================================
// CREATE REGISTRATION QR MODAL
// ==========================================

function createRegistrationQRModal(
    student
) {

    const old =
        getElement(
            "autoRegistrationQRModal"
        );


    if (old) {

        old.remove();

    }


    const studentId =
        student.studentId || "";

    const name =
        student.name || "";

    const grade =
        student.grade || "";

    const section =
        student.section || "";

    const photo =
        student.photo || "";


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "autoRegistrationQRModal";


    modal.style.position =
        "fixed";

    modal.style.inset =
        "0";

    modal.style.background =
        "rgba(0,0,0,.65)";

    modal.style.display =
        "flex";

    modal.style.alignItems =
        "center";

    modal.style.justifyContent =
        "center";

    modal.style.zIndex =
        "100000";

    modal.style.padding =
        "20px";


    modal.innerHTML = `

        <div
            style="
                position:relative;
                width:500px;
                max-width:95%;
                max-height:90vh;
                overflow:auto;
                background:white;
                border-radius:20px;
                padding:30px;
                text-align:center;
            "
        >

            <button
                id="registrationModalClose"
                type="button"
                style="
                    position:absolute;
                    top:10px;
                    right:15px;
                    border:none;
                    background:none;
                    font-size:30px;
                    cursor:pointer;
                "
            >
                &times;
            </button>

            <h1>
                Student Registered Successfully
            </h1>

            <div
                id="registrationBigQR"
                style="
                    display:flex;
                    justify-content:center;
                    margin:15px 0;
                "
            ></div>

            ${
                photo
                    ? `
                        <img
                            src="${escapeHTML(photo)}"
                            style="
                                width:100px;
                                height:100px;
                                border-radius:50%;
                                object-fit:cover;
                                margin:10px auto;
                            "
                        >
                      `
                    : ""
            }

            <h2>
                ${escapeHTML(name)}
            </h2>

            <p>
                <strong>LRN:</strong>
                ${escapeHTML(studentId)}
            </p>

            <p>
                <strong>Grade:</strong>
                ${escapeHTML(grade)}
            </p>

            <p>
                <strong>Section:</strong>
                ${escapeHTML(section)}
            </p>

            <div
                style="
                    display:flex;
                    justify-content:center;
                    gap:15px;
                    margin-top:25px;
                "
            >

                <button
                    id="printRegistrationQR"
                    type="button"
                >
                    <i
                        class="fa-solid fa-print"
                    ></i>

                    Print QR
                </button>

                <button
                    id="closeRegistrationQR"
                    type="button"
                >
                    Close
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // ======================================
    // QR
    // ======================================

    const qrContainer =
        getElement(
            "registrationBigQR"
        );


    if (
        qrContainer &&
        typeof QRCode !==
            "undefined"
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );


        qrContainer.appendChild(
            canvas
        );


        QRCode.toCanvas(
            canvas,
            studentId,
            {
                width: 220,
                height: 220,
                margin: 2
            },
            function(error) {

                if (error) {

                    console.error(
                        "Registration QR error:",
                        error
                    );

                }

            }
        );

    }


    // ======================================
    // CLOSE
    // ======================================

    const close =
        function() {

            modal.remove();

        };


    const closeButton =
        getElement(
            "registrationModalClose"
        );

    const closeButton2 =
        getElement(
            "closeRegistrationQR"
        );


    if (closeButton) {

        closeButton.onclick =
            close;

    }


    if (closeButton2) {

        closeButton2.onclick =
            close;

    }


    // ======================================
    // PRINT
    // ======================================

    const printButton =
        getElement(
            "printRegistrationQR"
        );


    if (printButton) {

        printButton.onclick =
            function() {

                window.print();

            };

    }


    // ======================================
    // OUTSIDE CLICK
    // ======================================

    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                modal
            ) {

                close();

            }

        }
    );

}


// ==========================================
// CLOSE QR
// ==========================================

function closeQR() {

    const modal =
        getElement(
            "qrModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// ==========================================
// DELETE STUDENT
// ==========================================

async function deleteStudent(id) {

    if (!id) {

        alert(
            "Student ID not found."
        );

        return;

    }


    if (
        !confirm(
            "Are you sure you want to delete this student?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/students/${encodeURIComponent(id)}`,
                {
                    method: "DELETE",

                    headers:
                        token
                            ? {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                            : {}

                }
            );


        const data =
            await response
                .json()
                .catch(
                    () => ({})
                );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Delete failed."
            );

        }


        alert(
            "Student deleted successfully."
        );


        await loadStudents();

    }
    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to delete student.\n\n" +
            error.message
        );

    }

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStudentStats(
    students
) {

    const totalStudents =
        getElement(
            "totalStudents"
        );

    const totalQR =
        getElement(
            "totalQR"
        );

    const totalSections =
        getElement(
            "totalSections"
        );

    const activeStudents =
        getElement(
            "activeStudents"
        );


    const total =
        Array.isArray(students)
            ? students.length
            : 0;


    const active =
        Array.isArray(students)
            ? students.filter(
                student =>
                    String(
                        student.status ||
                        "Active"
                    )
                        .toLowerCase() ===
                    "active"
            ).length
            : 0;


    const sections =
        new Set(
            (students || [])
                .map(
                    student =>
                        student.section ||
                        student.sectionName
                )
                .filter(Boolean)
        ).size;


    if (totalStudents) {

        totalStudents.textContent =
            total;

    }


    if (totalQR) {

        totalQR.textContent =
            total;

    }


    if (totalSections) {

        totalSections.textContent =
            sections;

    }


    if (activeStudents) {

        activeStudents.textContent =
            active;

    }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
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
// PAGE INITIALIZATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "===================================="
        );

        console.log(
            "SmartAttend Registration initialized."
        );

        console.log(
            "Role:",
            currentRole
        );

        console.log(
            "Teacher Grade:",
            teacherGrade
        );

        console.log(
            "Teacher Section:",
            teacherSection
        );

        console.log(
            "===================================="
        );


        // ==================================
        // USER NAME
        // ==================================

        const userName =
            getElement(
                "userName"
            );


        if (
            userName &&
            teacherName
        ) {

            userName.textContent =
                teacherName;

        }


        // ==================================
        // REGISTRATION GRADE
        // ==================================

        const grade =
            getElement(
                "grade"
            );


        if (grade) {

            grade.disabled = false;

            grade.addEventListener(
                "change",
                function() {

                    console.log(
                        "Registration grade changed:",
                        this.value
                    );

                    loadSections();

                }
            );

        }


        // ==================================
        // REGISTRATION SECTION
        // ==================================

        const section =
            getElement(
                "section"
            );


        if (section) {

            section.disabled = false;

        }


        // ==================================
        // INITIAL SECTION LOAD
        // ==================================

        loadSections();


        // ==================================
        // PHOTO
        // ==================================

        setupPhotoUpload();


        // ==================================
        // SEARCH
        // ==================================

        const search =
            getElement(
                "search"
            );


        if (search) {

            search.addEventListener(
                "input",
                function() {

                    loadStudents();

                }
            );

        }


        // ==================================
        // GRADE FILTER
        // ==================================

        const gradeFilter =
            getElement(
                "gradeFilter"
            );


        if (gradeFilter) {

            gradeFilter.disabled =
                false;

            gradeFilter.addEventListener(
                "change",
                function() {

                    loadSectionFilter();

                    loadStudents();

                }
            );

        }


        // ==================================
        // SECTION FILTER
        // ==================================

        const sectionFilter =
            getElement(
                "sectionFilter"
            );


        if (sectionFilter) {

            sectionFilter.disabled =
                false;

            sectionFilter.addEventListener(
                "change",
                function() {

                    loadStudents();

                }
            );

        }


        // ==================================
        // STATUS FILTER
        // ==================================

        const statusFilter =
            getElement(
                "statusFilter"
            );


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                function() {

                    loadStudents();

                }
            );

        }


        // ==================================
        // INITIAL FILTER
        // ==================================

        loadSectionFilter();


        // ==================================
        // LOAD STUDENTS
        // ==================================

        loadStudents();

    }
);


// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.loadSections =
    loadSections;

window.loadSectionFilter =
    loadSectionFilter;

window.saveStudent =
    saveStudent;

window.registerStudent =
    registerStudent;

window.loadStudents =
    loadStudents;

window.displayStudents =
    displayStudents;

window.generateQRCodes =
    generateQRCodes;

window.showLargeQRCode =
    showLargeQRCode;

window.showQRModal =
    showQRModal;

window.closeQR =
    closeQR;

window.deleteStudent =
    deleteStudent;

window.clearRegistrationForm =
    clearRegistrationForm;
