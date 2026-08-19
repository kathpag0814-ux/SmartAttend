// ======================================================
// SMARTATTEND - PROMOTE.JS
// Student Promotion
// ======================================================


// ======================================================
// API
// ======================================================

const API = "http://localhost:3000/api";


// ======================================================
// LOGGED-IN USER
// ======================================================

const currentRole =
    (localStorage.getItem("role") || "")
        .toLowerCase()
        .trim();

const teacherGrade =
    localStorage.getItem("grade") || "";

const teacherSection =
    localStorage.getItem("section") || "";

const teacherName =
    localStorage.getItem("fullName") || "";

const token =
    localStorage.getItem("token") || "";


console.log("====================================");
console.log("SMARTATTEND PROMOTION");
console.log("Role:", currentRole);
console.log("Teacher:", teacherName);
console.log("Grade:", teacherGrade);
console.log("Section:", teacherSection);
console.log("====================================");


// ======================================================
// SECTION DATABASE
// ======================================================

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


// ======================================================
// STUDENTS
// ======================================================

let students = [];

let displayedStudents = [];


// ======================================================
// ELEMENT
// ======================================================

function getElement(id) {

    return document.getElementById(id);

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Promote page loaded."
        );

        setupUserDisplay();

        setupFilters();

        loadStudents();

    }
);


// ======================================================
// USER DISPLAY
// ======================================================

function setupUserDisplay() {

    const userName =
        getElement("userName");

    const userRole =
        getElement("userRole");


    if (userName) {

        userName.textContent =
            teacherName ||
            (
                currentRole === "teacher"
                    ? "Teacher"
                    : "Administrator"
            );

    }


    if (userRole) {

        userRole.textContent =
            currentRole === "teacher"
                ? "Teacher"
                : "Admin";

    }


    // ==================================================
    // TEACHER
    // ==================================================

    if (currentRole === "teacher") {

        const assignment =
            getElement(
                "teacherAssignment"
            );

        const assignmentText =
            getElement(
                "teacherAssignmentText"
            );


        if (assignment) {

            assignment.style.display =
                "block";

        }


        if (assignmentText) {

            assignmentText.textContent =
                `${teacherGrade} — ${teacherSection}`;

        }


        // ==============================================
        // TEACHER MUST HAVE ASSIGNMENT
        // ==============================================

        if (
            !teacherGrade ||
            !teacherSection
        ) {

            console.error(
                "Teacher has no grade/section assignment."
            );

            showError(
                "Your teacher account does not have a Grade and Section assigned."
            );

        }

    }

}


// ======================================================
// FILTER SETUP
// ======================================================

function setupFilters() {

    const gradeFilter =
        getElement("gradeFilter");

    const sectionFilter =
        getElement("sectionFilter");

    const searchInput =
        getElement("searchStudent");

    const selectAll =
        getElement("selectAll");

    const headerSelectAll =
        getElement("headerSelectAll");

    const promoteSelected =
        getElement(
            "promoteSelectedBtn"
        );


    // ==================================================
    // TEACHER FILTER
    // ==================================================

    if (currentRole === "teacher") {

        if (gradeFilter) {

            gradeFilter.value =
                teacherGrade;

            gradeFilter.disabled =
                true;

            gradeFilter.style.opacity =
                "0.7";

            gradeFilter.style.cursor =
                "not-allowed";

        }


        if (sectionFilter) {

            sectionFilter.innerHTML =
                "";

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                teacherSection;

            option.textContent =
                teacherSection;

            option.selected =
                true;

            sectionFilter.appendChild(
                option
            );

            sectionFilter.disabled =
                true;

            sectionFilter.style.opacity =
                "0.7";

            sectionFilter.style.cursor =
                "not-allowed";

        }

    }


    // ==================================================
    // ADMIN FILTER
    // ==================================================

    else {

        if (gradeFilter) {

            gradeFilter.disabled =
                false;

            gradeFilter.addEventListener(
                "change",
                function () {

                    loadSectionFilter();

                    applyFilters();

                }
            );

        }


        if (sectionFilter) {

            sectionFilter.disabled =
                false;

            sectionFilter.addEventListener(
                "change",
                applyFilters
            );

        }

    }


    // ==================================================
    // SEARCH
    // ==================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    // ==================================================
    // SELECT ALL
    // ==================================================

    if (selectAll) {

        selectAll.addEventListener(
            "change",
            function () {

                toggleAllStudents(
                    this.checked
                );

            }
        );

    }


    if (headerSelectAll) {

        headerSelectAll.addEventListener(
            "change",
            function () {

                toggleAllStudents(
                    this.checked
                );

            }
        );

    }


    // ==================================================
    // PROMOTE SELECTED
    // ==================================================

    if (promoteSelected) {

        promoteSelected.addEventListener(
            "click",
            promoteSelectedStudents
        );

    }


    loadSectionFilter();

}


// ======================================================
// LOAD SECTION FILTER
// ======================================================

function loadSectionFilter() {

    const gradeFilter =
        getElement("gradeFilter");

    const sectionFilter =
        getElement("sectionFilter");


    if (!sectionFilter) {
        return;
    }


    // ==================================================
    // TEACHER
    // ==================================================

    if (currentRole === "teacher") {

        sectionFilter.innerHTML =
            "";

        const option =
            document.createElement(
                "option"
            );

        option.value =
            teacherSection;

        option.textContent =
            teacherSection;

        option.selected =
            true;

        sectionFilter.appendChild(
            option
        );

        return;

    }


    // ==================================================
    // ADMIN
    // ==================================================

    const selectedGrade =
        gradeFilter
            ? gradeFilter.value
            : "";


    sectionFilter.innerHTML =
        "";


    const allOption =
        document.createElement(
            "option"
        );

    allOption.value =
        "";

    allOption.textContent =
        "All Sections";

    sectionFilter.appendChild(
        allOption
    );


    let sectionList = [];


    if (selectedGrade) {

        sectionList =
            SECTIONS[selectedGrade] ||
            [];

    }

    else {

        Object.values(SECTIONS)
            .forEach(
                function (list) {

                    list.forEach(
                        function (section) {

                            if (
                                !sectionList.includes(
                                    section
                                )
                            ) {

                                sectionList.push(
                                    section
                                );

                            }

                        }
                    );

                }
            );

    }


    sectionList.forEach(
        function (section) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                section;

            option.textContent =
                section;

            sectionFilter.appendChild(
                option
            );

        }
    );

}


// ======================================================
// LOAD STUDENTS
// ======================================================

async function loadStudents() {

    const table =
        getElement("studentTable");


    if (!table) {

        console.error(
            "#studentTable not found."
        );

        return;

    }


    table.innerHTML = `

        <tr>

            <td
                colspan="8"
                style="
                    text-align:center;
                    padding:40px;
                "
            >

                <i class="fa-solid fa-spinner fa-spin"></i>

                Loading students...

            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API}/students`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        console.log(
            "Students response:",
            response.status
        );


        if (!response.ok) {

            const error =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );

            throw new Error(
                error.message ||
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Students data:",
            data
        );


        // ==================================================
        // GET ARRAY
        // ==================================================

        if (Array.isArray(data)) {

            students =
                data;

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

        else {

            students =
                [];

        }


        console.log(
            "Students received:",
            students.length
        );


        // ==================================================
        // CRITICAL TEACHER SECURITY FILTER
        // ==================================================

        if (
            currentRole === "teacher"
        ) {

            students =
                students.filter(
                    function (student) {

                        const studentGrade =
                            String(
                                student.grade ||
                                student.gradeLevel ||
                                ""
                            )
                            .trim();

                        const studentSection =
                            String(
                                student.section ||
                                student.sectionName ||
                                ""
                            )
                            .trim();


                        const allowed =
                            studentGrade ===
                                teacherGrade.trim()
                            &&
                            studentSection ===
                                teacherSection.trim();


                        if (!allowed) {

                            console.log(
                                "Hidden from teacher:",
                                student.name,
                                studentGrade,
                                studentSection
                            );

                        }


                        return allowed;

                    }
                );

            console.log(
                "Teacher-visible students:",
                students.length
            );

        }


        // ==================================================
        // ADMIN
        // ==================================================

        else {

            console.log(
                "Admin can see:",
                students.length
            );

        }


        displayedStudents =
            [...students];


        applyFilters();

    }

    catch (error) {

        console.error(
            "LOAD STUDENTS ERROR:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#b91c1c;
                    "
                >

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <br><br>

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


// ======================================================
// APPLY FILTERS
// ======================================================

function applyFilters() {

    const gradeFilter =
        getElement("gradeFilter");

    const sectionFilter =
        getElement("sectionFilter");

    const searchInput =
        getElement("searchStudent");


    let grade =
        gradeFilter
            ? gradeFilter.value
            : "";

    let section =
        sectionFilter
            ? sectionFilter.value
            : "";

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    // ==================================================
    // FORCE TEACHER ASSIGNMENT
    // ==================================================

    if (currentRole === "teacher") {

        grade =
            teacherGrade;

        section =
            teacherSection;

    }


    let filtered =
        students.filter(
            function (student) {

                const studentGrade =
                    String(
                        student.grade ||
                        student.gradeLevel ||
                        ""
                    )
                    .trim();

                const studentSection =
                    String(
                        student.section ||
                        student.sectionName ||
                        ""
                    )
                    .trim();

                const studentId =
                    String(
                        student.studentId ||
                        student.lrn ||
                        student.LRN ||
                        ""
                    )
                    .toLowerCase();

                const studentName =
                    String(
                        student.name ||
                        student.studentName ||
                        ""
                    )
                    .toLowerCase();


                const matchesGrade =
                    !grade ||
                    studentGrade ===
                        grade;

                const matchesSection =
                    !section ||
                    studentSection ===
                        section;

                const matchesSearch =
                    !search ||
                    studentId.includes(
                        search
                    ) ||
                    studentName.includes(
                        search
                    );


                return (
                    matchesGrade &&
                    matchesSection &&
                    matchesSearch
                );

            }
        );


    displayedStudents =
        filtered;


    displayStudents(
        displayedStudents
    );


    updateStats(
        displayedStudents
    );

}


// ======================================================
// DISPLAY STUDENTS
// ======================================================

function displayStudents(list) {

    const table =
        getElement("studentTable");


    if (!table) {
        return;
    }


    table.innerHTML =
        "";


    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    <i
                        class="fa-solid fa-users-slash"
                        style="
                            font-size:30px;
                            color:#94a3b8;
                        "
                    ></i>

                    <br><br>

                    ${
                        currentRole === "teacher"
                            ? "No students found in your assigned section."
                            : "No students found."
                    }

                </td>

            </tr>

        `;

        return;

    }


    list.forEach(
        function (student, index) {

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
                student.grade ||
                student.gradeLevel ||
                "";


            const section =
                student.section ||
                student.sectionName ||
                "";


            const databaseId =
                student._id ||
                student.id ||
                studentId;


            const row =
                document.createElement(
                    "tr"
                );


            row.dataset.studentId =
                databaseId;


            row.innerHTML = `

                <!-- CHECKBOX -->

                <td>

                    <input
                        type="checkbox"
                        class="student-checkbox"
                        data-id="${escapeHTML(
                            databaseId
                        )}"
                    >

                </td>


                <!-- LRN -->

                <td>

                    ${escapeHTML(
                        studentId
                    )}

                </td>


                <!-- NAME -->

                <td>

                    <strong>
                        ${escapeHTML(
                            name
                        )}
                    </strong>

                </td>


                <!-- CURRENT GRADE -->

                <td>

                    ${escapeHTML(
                        grade
                    )}

                </td>


                <!-- CURRENT SECTION -->

                <td>

                    ${escapeHTML(
                        section
                    )}

                </td>


                <!-- NEXT GRADE -->

                <td>

                    <select
                        class="next-grade"
                        data-id="${escapeHTML(
                            databaseId
                        )}"
                    >

                        <option value="">
                            Select New
                        </option>

                        ${buildNextGradeOptions(
                            grade
                        )}

                    </select>

                </td>


                <!-- NEW SECTION -->

                <td>

                    <select
                        class="new-section"
                        data-id="${escapeHTML(
                            databaseId
                        )}"
                        disabled
                    >

                        <option value="">
                            Select New
                        </option>

                    </select>

                </td>


                <!-- ACTION -->

                <td>

                    <button
                        type="button"
                        class="promote-one-btn"
                        data-id="${escapeHTML(
                            databaseId
                        )}"
                        disabled
                    >

                        <i class="fa-solid fa-arrow-up"></i>

                        Promote

                    </button>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );


    setupStudentControls();

}


// ======================================================
// BUILD NEXT GRADE
// ======================================================

function buildNextGradeOptions(
    currentGrade
) {

    const gradeNumber =
        parseInt(
            String(
                currentGrade
            )
            .replace(
                "Grade ",
                ""
            )
        );


    if (
        isNaN(
            gradeNumber
        )
    ) {

        return "";

    }


    const nextGrade =
        gradeNumber + 1;


    if (
        nextGrade > 12
    ) {

        return "";

    }


    return `

        <option
            value="Grade ${nextGrade}"
        >
            Grade ${nextGrade}
        </option>

    `;

}


// ======================================================
// STUDENT CONTROLS
// ======================================================

function setupStudentControls() {

    const gradeSelects =
        document.querySelectorAll(
            ".next-grade"
        );


    const sectionSelects =
        document.querySelectorAll(
            ".new-section"
        );


    const promoteButtons =
        document.querySelectorAll(
            ".promote-one-btn"
        );


    // ==================================================
    // NEXT GRADE
    // ==================================================

    gradeSelects.forEach(
        function (gradeSelect) {

            gradeSelect.addEventListener(
                "change",
                function () {

                    const row =
                        this.closest(
                            "tr"
                        );


                    if (!row) {
                        return;
                    }


                    const newSection =
                        row.querySelector(
                            ".new-section"
                        );


                    const promoteButton =
                        row.querySelector(
                            ".promote-one-btn"
                        );


                    if (!newSection) {
                        return;
                    }


                    newSection.innerHTML =
                        "";


                    const defaultOption =
                        document.createElement(
                            "option"
                        );


                    defaultOption.value =
                        "";

                    defaultOption.textContent =
                        "Select New";


                    newSection.appendChild(
                        defaultOption
                    );


                    const nextGrade =
                        this.value;


                    if (!nextGrade) {

                        newSection.disabled =
                            true;

                        if (promoteButton) {

                            promoteButton.disabled =
                                true;

                        }

                        return;

                    }


                    // ==================================
                    // LOAD SECTIONS FOR NEXT GRADE
                    // ==================================

                    const nextSections =
                        SECTIONS[
                            nextGrade
                        ] || [];


                    nextSections.forEach(
                        function (
                            sectionName
                        ) {

                            const option =
                                document.createElement(
                                    "option"
                                );

                            option.value =
                                sectionName;

                            option.textContent =
                                sectionName;

                            newSection.appendChild(
                                option
                            );

                        }
                    );


                    // ==================================
                    // ENABLE
                    // ==================================

                    newSection.disabled =
                        false;


                    // ==================================
                    // CURRENT SECTION MATCH
                    // ==================================

                    const currentSection =
                        row.children[4]
                            ?.textContent
                            ?.trim();


                    if (
                        currentSection &&
                        nextSections.includes(
                            currentSection
                        )
                    ) {

                        newSection.value =
                            currentSection;

                    }


                    updatePromoteButton(
                        row
                    );

                }
            );

        }
    );


    // ==================================================
    // NEW SECTION
    // ==================================================

    sectionSelects.forEach(
        function (sectionSelect) {

            sectionSelect.addEventListener(
                "change",
                function () {

                    const row =
                        this.closest(
                            "tr"
                        );


                    if (row) {

                        updatePromoteButton(
                            row
                        );

                    }

                }
            );

        }
    );


    // ==================================================
    // PROMOTE ONE
    // ==================================================

    promoteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    promoteOneStudent(
                        this.dataset.id
                    );

                }
            );

        }
    );


    // ==================================================
    // CHECKBOXES
    // ==================================================

    const checkboxes =
        document.querySelectorAll(
            ".student-checkbox"
        );


    checkboxes.forEach(
        function (checkbox) {

            checkbox.addEventListener(
                "change",
                updateSelectedCount
            );

        }
    );


    updateSelectedCount();

}


// ======================================================
// UPDATE PROMOTE BUTTON
// ======================================================

function updatePromoteButton(row) {

    const nextGrade =
        row.querySelector(
            ".next-grade"
        );


    const newSection =
        row.querySelector(
            ".new-section"
        );


    const button =
        row.querySelector(
            ".promote-one-btn"
        );


    if (
        !nextGrade ||
        !newSection ||
        !button
    ) {

        return;

    }


    button.disabled =
        !nextGrade.value ||
        !newSection.value;


    if (button.disabled) {

        button.style.opacity =
            "0.5";

        button.style.cursor =
            "not-allowed";

    }

    else {

        button.style.opacity =
            "1";

        button.style.cursor =
            "pointer";

    }

}


// ======================================================
// PROMOTE ONE STUDENT
// ======================================================

async function promoteOneStudent(
    id
) {

    const row =
        document.querySelector(
            `tr[data-student-id="${CSS.escape(id)}"]`
        );


    if (!row) {

        alert(
            "Student row not found."
        );

        return;

    }


    const nextGrade =
        row.querySelector(
            ".next-grade"
        )?.value;


    const newSection =
        row.querySelector(
            ".new-section"
        )?.value;


    if (!nextGrade) {

        alert(
            "Please select the Next Grade."
        );

        return;

    }


    if (!newSection) {

        alert(
            "Please select the New Section."
        );

        return;

    }


    const student =
        students.find(
            function (item) {

                return String(
                    item._id ||
                    item.id ||
                    item.studentId ||
                    item.lrn
                ) === String(id);

            }
        );


    if (!student) {

        alert(
            "Student information was not found."
        );

        return;

    }


    const studentName =
        student.name ||
        student.studentName ||
        "Student";


    const confirmed =
        confirm(
            `Promote ${studentName} to ${nextGrade} - ${newSection}?`
        );


    if (!confirmed) {
        return;
    }


    const button =
        row.querySelector(
            ".promote-one-btn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Promoting...';

    }


    try {

        const databaseId =
            student._id ||
            student.id;


        if (!databaseId) {

            throw new Error(
                "Student database ID is missing."
            );

        }


        const response =
            await fetch(
                `${API}/students/${encodeURIComponent(databaseId)}`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            grade:
                                nextGrade,

                            section:
                                newSection

                        })

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
                data.error ||
                `Server returned ${response.status}`
            );

        }


        alert(
            `${studentName} was successfully promoted to ${nextGrade} - ${newSection}.`
        );


        await loadStudents();

    }

    catch (error) {

        console.error(
            "Promotion error:",
            error
        );


        alert(
            "Unable to promote student.\n\n" +
            error.message
        );


        if (button) {

            button.disabled =
                false;

            button.innerHTML =
                '<i class="fa-solid fa-arrow-up"></i> Promote';

        }

    }

}


// ======================================================
// PROMOTE SELECTED
// ======================================================

async function promoteSelectedStudents() {

    const checkboxes =
        document.querySelectorAll(
            ".student-checkbox:checked"
        );


    if (
        checkboxes.length === 0
    ) {

        alert(
            "Please select at least one student."
        );

        return;

    }


    const promotions = [];


    for (
        const checkbox of checkboxes
    ) {

        const row =
            checkbox.closest(
                "tr"
            );


        if (!row) {
            continue;
        }


        const id =
            checkbox.dataset.id;


        const nextGrade =
            row.querySelector(
                ".next-grade"
            )?.value;


        const newSection =
            row.querySelector(
                ".new-section"
            )?.value;


        if (
            !nextGrade ||
            !newSection
        ) {

            alert(
                "Please select the Next Grade and New Section for every selected student."
            );

            return;

        }


        promotions.push({

            id:
                id,

            nextGrade:
                nextGrade,

            newSection:
                newSection

        });

    }


    const confirmed =
        confirm(
            `Promote ${promotions.length} selected student(s)?`
        );


    if (!confirmed) {
        return;
    }


    const button =
        getElement(
            "promoteSelectedBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Promoting...';

    }


    try {

        for (
            const promotion
            of promotions
        ) {

            const student =
                students.find(
                    function (item) {

                        return String(
                            item._id ||
                            item.id ||
                            item.studentId ||
                            item.lrn
                        ) ===
                        String(
                            promotion.id
                        );

                    }
                );


            if (!student) {
                continue;
            }


            const databaseId =
                student._id ||
                student.id;


            const response =
                await fetch(
                    `${API}/students/${encodeURIComponent(databaseId)}`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                grade:
                                    promotion.nextGrade,

                                section:
                                    promotion.newSection

                            })

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
                    data.error ||
                    `Promotion failed for ${student.name || "student"}`
                );

            }

        }


        alert(
            "Selected students were promoted successfully."
        );


        await loadStudents();

    }

    catch (error) {

        console.error(
            "Bulk promotion error:",
            error
        );


        alert(
            "Unable to complete promotion.\n\n" +
            error.message
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.innerHTML =
                '<i class="fa-solid fa-arrow-up"></i> Promote Selected';

        }

    }

}


// ======================================================
// SELECT ALL
// ======================================================

function toggleAllStudents(
    checked
) {

    const checkboxes =
        document.querySelectorAll(
            ".student-checkbox"
        );


    checkboxes.forEach(
        function (checkbox) {

            checkbox.checked =
                checked;

        }
    );


    const selectAll =
        getElement("selectAll");

    const headerSelectAll =
        getElement(
            "headerSelectAll"
        );


    if (selectAll) {

        selectAll.checked =
            checked;

    }


    if (headerSelectAll) {

        headerSelectAll.checked =
            checked;

    }


    updateSelectedCount();

}


// ======================================================
// UPDATE SELECTED COUNT
// ======================================================

function updateSelectedCount() {

    const selected =
        document.querySelectorAll(
            ".student-checkbox:checked"
        ).length;


    const element =
        getElement(
            "selectedStudents"
        );


    if (element) {

        element.textContent =
            selected;

    }

}


// ======================================================
// UPDATE STATS
// ======================================================

function updateStats(
    list
) {

    const total =
        getElement(
            "totalStudents"
        );

    const ready =
        getElement(
            "readyStudents"
        );


    if (total) {

        total.textContent =
            list.length;

    }


    if (ready) {

        ready.textContent =
            list.length;

    }


    updateSelectedCount();

}


// ======================================================
// ERROR
// ======================================================

function showError(
    message
) {

    const table =
        getElement(
            "studentTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = `

        <tr>

            <td
                colspan="8"
                style="
                    text-align:center;
                    padding:40px;
                    color:#b91c1c;
                "
            >

                <i
                    class="fa-solid fa-triangle-exclamation"
                    style="
                        font-size:35px;
                    "
                ></i>

                <br><br>

                ${escapeHTML(
                    message
                )}

            </td>

        </tr>

    `;

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(
    value
) {

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


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.loadStudents =
    loadStudents;

window.applyFilters =
    applyFilters;

window.loadSectionFilter =
    loadSectionFilter;

window.promoteOneStudent =
    promoteOneStudent;

window.promoteSelectedStudents =
    promoteSelectedStudents;

window.toggleAllStudents =
    toggleAllStudents;