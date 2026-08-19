// ==========================================
// SMARTATTEND - REPORTS.JS
// Attendance Reports
// ==========================================

const API = "http://localhost:3000/api";

let reports = [];
let filteredReports = [];


// ==========================================
// LOGGED-IN USER
// ==========================================

const currentRole =
    (localStorage.getItem("role") || "").toLowerCase();

const teacherGrade =
    localStorage.getItem("grade") || "";

const teacherSection =
    localStorage.getItem("section") || "";

const teacherName =
    localStorage.getItem("fullName") || "Administrator";

const token =
    localStorage.getItem("token") || "";


console.log("====================================");
console.log("SMARTATTEND REPORTS");
console.log("Role:", currentRole);
console.log("Teacher:", teacherName);
console.log("Grade:", teacherGrade);
console.log("Section:", teacherSection);
console.log("====================================");


// ==========================================
// SECTION LIST
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
// TEACHER CHECK
// ==========================================

function isTeacher() {

    return currentRole === "teacher";

}


// ==========================================
// GET GRADE
// ==========================================

function getReportGrade() {

    if (isTeacher()) {

        return teacherGrade;

    }

    const element =
        document.getElementById("gradeFilter");

    return element
        ? element.value.trim()
        : "";

}


// ==========================================
// GET SECTION
// ==========================================

function getReportSection() {

    if (isTeacher()) {

        return teacherSection;

    }

    const element =
        document.getElementById("sectionFilter");

    return element
        ? element.value.trim()
        : "";

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SmartAttend Reports loaded."
        );


        applyTeacherRestrictions();

        loadSections();

        setupReportEvents();


        // Do NOT automatically load today.
        // User chooses the date first.

        const dateInput =
            document.getElementById("reportDate");


        if (dateInput) {

            dateInput.value = "";

        }


        displayReports([]);

        updateSummary({
            total: 0,
            present: 0,
            late: 0,
            absent: 0
        });

    }
);


// ==========================================
// SETUP EVENTS
// ==========================================

function setupReportEvents() {

    const gradeFilter =
        document.getElementById("gradeFilter");

    const sectionFilter =
        document.getElementById("sectionFilter");

    const reportDate =
        document.getElementById("reportDate");

    const searchInput =
        document.getElementById("searchReport");

    const viewReportBtn =
        document.getElementById("viewReportBtn");

    const todayReportBtn =
        document.getElementById("todayReportBtn");

    const generateReportBtn =
        document.getElementById("generateReportBtn");

    const exportPdfBtn =
        document.getElementById("exportPdfBtn");

    const exportExcelBtn =
        document.getElementById("exportExcelBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // ======================================
    // VIEW REPORT
    // ======================================

    if (viewReportBtn) {

        viewReportBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                console.log(
                    "VIEW REPORT CLICKED"
                );


                const selectedDate =
                    reportDate
                        ? reportDate.value
                        : "";


                // Date is REQUIRED

                if (!selectedDate) {

                    alert(
                        "Please select an attendance date first."
                    );

                    return;

                }


                console.log(
                    "Selected date:",
                    selectedDate
                );


                loadReports();

            }
        );

    }


    // ======================================
    // TODAY
    // ======================================

    if (todayReportBtn) {

        todayReportBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                setTodayReport();

            }
        );

    }


    // ======================================
    // GENERATE REPORT
    // ======================================

    if (generateReportBtn) {

        generateReportBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                loadReports();

            }
        );

    }


    // ======================================
    // PDF
    // ======================================

    if (exportPdfBtn) {

        exportPdfBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                exportPDF();

            }
        );

    }


    // ======================================
    // EXCEL
    // ======================================

    if (exportExcelBtn) {

        exportExcelBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                exportExcel();

            }
        );

    }


    // ======================================
    // LOGOUT
    // ======================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (
                    typeof logout ===
                    "function"
                ) {

                    logout();

                } else {

                    localStorage.clear();

                    window.location.href =
                        "login.html";

                }

            }
        );

    }


    // ======================================
    // GRADE CHANGE
    // ======================================

    if (gradeFilter) {

        gradeFilter.addEventListener(
            "change",
            function () {

                if (isTeacher()) {

                    gradeFilter.value =
                        teacherGrade;

                    return;

                }


                loadSections();

            }
        );

    }


    // ======================================
    // SECTION CHANGE
    // ======================================

    if (sectionFilter) {

        sectionFilter.addEventListener(
            "change",
            function () {

                if (isTeacher()) {

                    sectionFilter.value =
                        teacherSection;

                    return;

                }

            }
        );

    }


    // ======================================
    // DATE CHANGE
    // ======================================

    if (reportDate) {

        reportDate.addEventListener(
            "change",
            function () {

                console.log(
                    "Date selected:",
                    this.value
                );

            }
        );

    }


    // ======================================
    // SEARCH
    // ======================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                searchReports(
                    this.value
                );

            }
        );

    }

}


// ==========================================
// TEACHER RESTRICTIONS
// ==========================================

function applyTeacherRestrictions() {

    const gradeFilter =
        document.getElementById(
            "gradeFilter"
        );

    const sectionFilter =
        document.getElementById(
            "sectionFilter"
        );


    if (!isTeacher()) {

        if (gradeFilter) {

            gradeFilter.disabled =
                false;

        }

        if (sectionFilter) {

            sectionFilter.disabled =
                false;

        }

        return;

    }


    if (gradeFilter) {

        gradeFilter.value =
            teacherGrade;

        gradeFilter.disabled =
            true;

    }


    if (sectionFilter) {

        sectionFilter.innerHTML = "";


        const option =
            document.createElement(
                "option"
            );


        option.value =
            teacherSection;


        option.textContent =
            teacherSection ||
            "No section assigned";


        option.selected =
            true;


        sectionFilter.appendChild(
            option
        );


        sectionFilter.value =
            teacherSection;


        sectionFilter.disabled =
            true;

    }

}


// ==========================================
// LOAD SECTIONS
// ==========================================

function loadSections() {

    const gradeFilter =
        document.getElementById(
            "gradeFilter"
        );

    const sectionFilter =
        document.getElementById(
            "sectionFilter"
        );


    if (!sectionFilter) {

        return;

    }


    if (isTeacher()) {

        sectionFilter.innerHTML = "";


        const option =
            document.createElement(
                "option"
            );


        option.value =
            teacherSection;


        option.textContent =
            teacherSection ||
            "No section assigned";


        sectionFilter.appendChild(
            option
        );


        return;

    }


    const selectedGrade =
        gradeFilter
            ? gradeFilter.value
            : "";


    sectionFilter.innerHTML = "";


    const allOption =
        document.createElement(
            "option"
        );


    allOption.value = "";

    allOption.textContent =
        "All Sections";


    sectionFilter.appendChild(
        allOption
    );


    let sectionList = [];


    if (selectedGrade) {

        sectionList =
            sections[selectedGrade] || [];

    } else {

        Object.values(sections)
            .forEach(
                function (gradeSections) {

                    gradeSections.forEach(
                        function (sectionName) {

                            if (
                                !sectionList.includes(
                                    sectionName
                                )
                            ) {

                                sectionList.push(
                                    sectionName
                                );

                            }

                        }
                    );

                }
            );

    }


    sectionList.forEach(
        function (sectionName) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                sectionName;


            option.textContent =
                sectionName;


            sectionFilter.appendChild(
                option
            );

        }
    );

}


// ==========================================
// TODAY BUTTON
// ==========================================

function setTodayReport() {

    const dateInput =
        document.getElementById(
            "reportDate"
        );


    if (!dateInput) {

        return;

    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    const todayString =
        `${year}-${month}-${day}`;


    dateInput.value =
        todayString;


    console.log(
        "Today:",
        todayString
    );


    loadReports();

}


// ==========================================
// VIEW REPORT
// ==========================================

function loadAttendanceReport() {

    const dateInput =
        document.getElementById(
            "reportDate"
        );


    if (
        !dateInput ||
        !dateInput.value
    ) {

        alert(
            "Please select an attendance date first."
        );

        return;

    }


    loadReports();

}


// ==========================================
// LOAD REPORTS
// ==========================================

async function loadReports() {

    const dateInput =
        document.getElementById(
            "reportDate"
        );


    const selectedDate =
        dateInput
            ? dateInput.value
            : "";


    // ======================================
    // DATE IS REQUIRED
    // ======================================

    if (!selectedDate) {

        alert(
            "Please select an attendance date first."
        );

        return;

    }


    const grade =
        getReportGrade();


    const section =
        getReportSection();


    console.log(
        "===================================="
    );

    console.log(
        "LOADING REPORT"
    );

    console.log(
        "DATE:",
        selectedDate
    );

    console.log(
        "GRADE:",
        grade
    );

    console.log(
        "SECTION:",
        section
    );

    console.log(
        "===================================="
    );


    // ======================================
    // BUILD API URL
    // ======================================

    let url =
        `${API}/reports`;


    const params = [];


    if (grade) {

        params.push(
            `grade=${encodeURIComponent(
                grade
            )}`
        );

    }


    if (section) {

        params.push(
            `section=${encodeURIComponent(
                section
            )}`
        );

    }


    // IMPORTANT:
    // Send the selected date to backend

    params.push(
        `date=${encodeURIComponent(
            selectedDate
        )}`
    );


    url +=
        "?" +
        params.join("&");


    console.log(
        "REPORT URL:",
        url
    );


    // ======================================
    // SHOW LOADING
    // ======================================

    displayLoading();


    try {

        const headers = {

            "Content-Type":
                "application/json"

        };


        if (token) {

            headers[
                "Authorization"
            ] =
                `Bearer ${token}`;

        }


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    headers: headers
                }
            );


        console.log(
            "HTTP STATUS:",
            response.status
        );


        if (!response.ok) {

            let errorData = {};

            try {

                errorData =
                    await response.json();

            } catch {

                // ignore

            }


            throw new Error(
                errorData.message ||
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "SERVER REPORT DATA:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load report."
            );

        }


        reports =
            Array.isArray(
                data.reports
            )
                ? data.reports
                : [];


        // ======================================
        // EXTRA FRONTEND DATE FILTER
        // ======================================
        // This guarantees that only the selected
        // date is displayed.

        reports =
            reports.filter(
                function (record) {

                    return recordMatchesDate(
                        record,
                        selectedDate
                    );

                }
            );


        // ======================================
        // TEACHER FILTER
        // ======================================

        if (isTeacher()) {

            reports =
                reports.filter(
                    function (record) {

                        const recordGrade =
                            String(
                                record.grade ||
                                record.gradeLevel ||
                                ""
                            ).trim();


                        const recordSection =
                            String(
                                record.section ||
                                record.sectionName ||
                                ""
                            ).trim();


                        return (

                            recordGrade ===
                            teacherGrade

                            &&

                            recordSection ===
                            teacherSection

                        );

                    }
                );

        }


        filteredReports =
            [...reports];


        // ======================================
        // DISPLAY
        // ======================================

        displayReports(
            filteredReports
        );


        // ======================================
        // SUMMARY
        // ======================================

        updateSummary(
            calculateSummary(
                filteredReports
            )
        );


        console.log(
            "FINAL REPORT RECORDS:",
            filteredReports
        );

    }

    catch (error) {

        console.error(
            "REPORT ERROR:",
            error
        );


        reports = [];

        filteredReports = [];


        displayReports([]);


        updateSummary({

            total: 0,
            present: 0,
            late: 0,
            absent: 0

        });


        alert(
            "Cannot load attendance reports.\n\n" +
            error.message
        );

    }

}


// ==========================================
// MATCH RECORD TO SELECTED DATE
// ==========================================

function recordMatchesDate(
    record,
    selectedDate
) {

    if (!record || !selectedDate) {

        return false;

    }


    // --------------------------------------
    // CASE 1: record.date
    // --------------------------------------

    if (record.date) {

        const recordDate =
            String(
                record.date
            ).substring(
                0,
                10
            );


        if (
            recordDate ===
            selectedDate
        ) {

            return true;

        }

    }


    // --------------------------------------
    // CASE 2: record.createdAt
    // --------------------------------------

    if (record.createdAt) {

        const formatted =
            formatRecordDate(
                record.createdAt
            );


        if (
            formatted ===
            selectedDate
        ) {

            return true;

        }

    }


    // --------------------------------------
    // CASE 3: record.timestamp
    // --------------------------------------

    if (record.timestamp) {

        const formatted =
            formatRecordDate(
                record.timestamp
            );


        if (
            formatted ===
            selectedDate
        ) {

            return true;

        }

    }


    return false;

}


// ==========================================
// LOADING DISPLAY
// ==========================================

function displayLoading() {

    const table =
        document.getElementById(
            "reportTable"
        );


    if (!table) return;


    table.innerHTML = `

        <tr>

            <td
                colspan="7"
                style="
                    text-align:center;
                    padding:30px;
                "
            >

                <i class="fa-solid fa-spinner fa-spin"></i>

                Loading attendance report...

            </td>

        </tr>

    `;

}


// ==========================================
// CALCULATE SUMMARY
// ==========================================

function calculateSummary(data) {

    const summary = {

        total: 0,
        present: 0,
        late: 0,
        absent: 0

    };


    if (!Array.isArray(data)) {

        return summary;

    }


    summary.total =
        data.length;


    data.forEach(
        function (record) {

            const status =
                String(
                    record.status ||
                    "Present"
                )
                .toLowerCase()
                .trim();


            if (status === "present") {

                summary.present++;

            }

            else if (status === "late") {

                summary.late++;

            }

            else if (status === "absent") {

                summary.absent++;

            }

            else {

                summary.present++;

            }

        }
    );


    return summary;

}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary(summary) {

    if (!summary) return;


    const total =
        document.getElementById(
            "totalAttendance"
        );

    const present =
        document.getElementById(
            "present"
        );

    const late =
        document.getElementById(
            "late"
        );

    const absent =
        document.getElementById(
            "absent"
        );


    if (total) {

        total.textContent =
            summary.total || 0;

    }


    if (present) {

        present.textContent =
            summary.present || 0;

    }


    if (late) {

        late.textContent =
            summary.late || 0;

    }


    if (absent) {

        absent.textContent =
            summary.absent || 0;

    }

}


// ==========================================
// DISPLAY REPORTS
// ==========================================

function displayReports(data) {

    const table =
        document.getElementById(
            "reportTable"
        );


    if (!table) {

        console.error(
            "#reportTable not found."
        );

        return;

    }


    table.innerHTML = "";


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No attendance records found
                    for the selected date.

                </td>

            </tr>

        `;


        return;

    }


    data.forEach(
        function (record) {

            const studentId =
                record.studentId ||
                record.rfid ||
                record.lrn ||
                "";


            const name =
                record.name ||
                record.studentName ||
                "Unknown";


            const grade =
                record.grade ||
                record.gradeLevel ||
                "";


            const section =
                record.section ||
                record.sectionName ||
                "";


            const date =
                record.date
                    ? String(record.date)
                        .substring(0, 10)
                    : formatRecordDate(
                        record.createdAt ||
                        record.timestamp
                    );


            const time =
                record.time ||
                formatRecordTime(
                    record.createdAt ||
                    record.timestamp
                );


            const status =
                record.status ||
                "Present";


            const statusClass =
                String(status)
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "-"
                    );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(studentId)}
                </td>

                <td>
                    <span class="student-name">
                        ${escapeHTML(name)}
                    </span>
                </td>

                <td>
                    ${escapeHTML(grade)}
                </td>

                <td>
                    ${escapeHTML(section)}
                </td>

                <td>
                    ${escapeHTML(date)}
                </td>

                <td>
                    ${escapeHTML(time)}
                </td>

                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${escapeHTML(status)}

                    </span>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// ==========================================
// SEARCH
// ==========================================

function searchReports(text) {

    const searchText =
        String(text)
            .toLowerCase()
            .trim();


    if (!searchText) {

        filteredReports =
            [...reports];

    }

    else {

        filteredReports =
            reports.filter(
                function (record) {

                    const studentId =
                        String(
                            record.studentId ||
                            record.rfid ||
                            record.lrn ||
                            ""
                        )
                        .toLowerCase();


                    const name =
                        String(
                            record.name ||
                            record.studentName ||
                            ""
                        )
                        .toLowerCase();


                    const grade =
                        String(
                            record.grade ||
                            record.gradeLevel ||
                            ""
                        )
                        .toLowerCase();


                    const section =
                        String(
                            record.section ||
                            record.sectionName ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        studentId.includes(
                            searchText
                        )

                        ||

                        name.includes(
                            searchText
                        )

                        ||

                        grade.includes(
                            searchText
                        )

                        ||

                        section.includes(
                            searchText
                        )

                    );

                }
            );

    }


    displayReports(
        filteredReports
    );


    updateSummary(
        calculateSummary(
            filteredReports
        )
    );

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatRecordDate(value) {

    if (!value) {

        return "";

    }


    try {

        const date =
            new Date(value);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return String(value)
                .substring(0, 10);

        }


        return [

            date.getFullYear(),

            String(
                date.getMonth() + 1
            ).padStart(2, "0"),

            String(
                date.getDate()
            ).padStart(2, "0")

        ].join("-");

    }

    catch {

        return String(value)
            .substring(0, 10);

    }

}


// ==========================================
// TIME FORMAT
// ==========================================

function formatRecordTime(value) {

    if (!value) {

        return "";

    }


    try {

        const date =
            new Date(value);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return date.toLocaleTimeString(
            "en-PH",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        );

    }

    catch {

        return String(value);

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
// EXPORT PDF
// ==========================================

function exportPDF() {

    if (
        typeof window.jspdf ===
        "undefined"
    ) {

        alert(
            "jsPDF is not loaded."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const doc =
        new jsPDF();


    // ======================================
    // REPORT INFORMATION
    // ======================================

    const grade =
        getReportGrade() ||
        "All Grades";


    const section =
        getReportSection() ||
        "All Sections";


    const date =
        document.getElementById(
            "reportDate"
        )?.value ||
        "Selected Date";


    // ======================================
    // ASSIGNED TEACHER
    // ======================================
    // For teachers, use the logged-in teacher.
    // For administrators, use the teacher
    // assigned to the selected section if
    // available in the report data.
    // ======================================

    let assignedTeacher =
        teacherName ||
        "Administrator";


    // If report records contain an adviser /
    // teacher field, use that value first.

    if (
        filteredReports &&
        filteredReports.length > 0
    ) {

        const firstRecord =
            filteredReports[0];


        assignedTeacher =
            firstRecord.adviser ||
            firstRecord.adviserName ||
            firstRecord.assignedTeacher ||
            firstRecord.teacher ||
            firstRecord.teacherName ||
            assignedTeacher;

    }


    // ======================================
    // PDF TITLE
    // ======================================

    doc.setFontSize(18);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "SMARTATTEND ATTENDANCE REPORT",
        14,
        15
    );


    // ======================================
    // REPORT DETAILS
    // ======================================

    doc.setFontSize(11);

    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        `Date: ${date}`,
        14,
        25
    );


    doc.text(
        `Grade: ${grade}`,
        14,
        32
    );


    // SECTION
    doc.text(
        `Section: ${section}`,
        14,
        39
    );


    // ======================================
    // ASSIGNED TEACHER
    // ======================================
    // This is placed directly BELOW Section.
    // ======================================

    doc.text(
        `Assigned Teacher: ${assignedTeacher}`,
        14,
        46
    );


    // ======================================
    // CHECK AUTOTABLE
    // ======================================

    if (
        typeof doc.autoTable !==
        "function"
    ) {

        alert(
            "jsPDF AutoTable is not loaded."
        );

        return;

    }


    // ======================================
    // ATTENDANCE TABLE
    // ======================================

    doc.autoTable({

        startY: 55,

        head: [[
            "LRN",
            "Name",
            "Grade",
            "Section",
            "Date",
            "Time",
            "Status"
        ]],

        body:
            filteredReports.map(
                function (record) {

                    return [

                        record.studentId ||
                        record.rfid ||
                        record.lrn ||
                        "",

                        record.name ||
                        record.studentName ||
                        "Unknown",

                        record.grade ||
                        record.gradeLevel ||
                        "",

                        record.section ||
                        record.sectionName ||
                        "",

                        record.date
                            ? String(
                                record.date
                            ).substring(0, 10)
                            : formatRecordDate(
                                record.createdAt ||
                                record.timestamp
                            ),

                        record.time ||
                        formatRecordTime(
                            record.createdAt ||
                            record.timestamp
                        ),

                        record.status ||
                        "Present"

                    ];

                }
            )

    });


    // ======================================
    // FILE NAME
    // ======================================

    const safeDate =
        date.replace(
            /[^a-z0-9-]/gi,
            "_"
        );


    doc.save(
        `Attendance-${safeDate}.pdf`
    );

}


// ==========================================
// EXPORT EXCEL
// ==========================================

function exportExcel() {

    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "XLSX library is not loaded."
        );

        return;

    }


    const exportData =
        filteredReports.map(
            function (record) {

                return {

                    "LRN":
                        record.studentId ||
                        record.rfid ||
                        record.lrn ||
                        "",

                    "Name":
                        record.name ||
                        record.studentName ||
                        "Unknown",

                    "Grade":
                        record.grade ||
                        record.gradeLevel ||
                        "",

                    "Section":
                        record.section ||
                        record.sectionName ||
                        "",

                    "Date":
                        record.date ||
                        formatRecordDate(
                            record.createdAt ||
                            record.timestamp
                        ),

                    "Time":
                        record.time ||
                        formatRecordTime(
                            record.createdAt ||
                            record.timestamp
                        ),

                    "Status":
                        record.status ||
                        "Present"

                };

            }
        );


    const sheet =
        XLSX.utils.json_to_sheet(
            exportData
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        sheet,
        "Attendance"
    );


    const date =
        document.getElementById(
            "reportDate"
        )?.value ||
        "Selected-Date";


    XLSX.writeFile(
        workbook,
        `Attendance-${date}.xlsx`
    );

}


// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.loadAttendanceReport =
    loadAttendanceReport;

window.setTodayReport =
    setTodayReport;

window.loadSections =
    loadSections;

window.loadReports =
    loadReports;

window.searchReports =
    searchReports;

window.exportPDF =
    exportPDF;

window.exportExcel =
    exportExcel;