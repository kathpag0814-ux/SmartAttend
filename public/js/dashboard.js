// ===============================
// SMARTATTEND - DASHBOARD.JS
// ===============================

// ===============================
// CURRENT USER
// ===============================

const currentRole =
    (localStorage.getItem("role") || "").toLowerCase();

const teacherGrade =
    localStorage.getItem("grade") || "";

const teacherSection =
    localStorage.getItem("section") || "";


// ===============================
// API
// ===============================

const API = "/api";


// ===============================
// CHART
// ===============================

let attendanceChart = null;


// ===============================
// SOCKET.IO
// ===============================

let socket = null;

if (typeof io === "function") {

    socket = io();

    socket.on("attendanceUpdated", function () {

        console.log(
            "Attendance updated. Refreshing dashboard..."
        );

        loadDashboard();
        loadAttendance();

    });

}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SmartAttend Dashboard loaded."
        );

        loadDashboard();
        loadAttendance();

    }
);


// ===============================
// LOAD DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        // --------------------------------
        // API URLS
        // --------------------------------

        let studentURL =
            `${API}/students`;

        let attendanceURL =
            `${API}/attendance`;


        // --------------------------------
        // TEACHER FILTER
        // --------------------------------

        if (
            currentRole === "teacher" &&
            teacherGrade &&
            teacherSection
        ) {

            studentURL +=
                `?grade=${encodeURIComponent(
                    teacherGrade
                )}&section=${encodeURIComponent(
                    teacherSection
                )}`;

            attendanceURL +=
                `?grade=${encodeURIComponent(
                    teacherGrade
                )}&section=${encodeURIComponent(
                    teacherSection
                )}`;

        }


        console.log(
            "Student URL:",
            studentURL
        );

        console.log(
            "Attendance URL:",
            attendanceURL
        );


        // --------------------------------
        // FETCH BOTH APIs
        // --------------------------------

        const [
            studentsResponse,
            attendanceResponse
        ] = await Promise.all([

            fetch(studentURL),

            fetch(attendanceURL)

        ]);


        if (!studentsResponse.ok) {

            throw new Error(
                `Students server returned ${studentsResponse.status}`
            );

        }


        if (!attendanceResponse.ok) {

            throw new Error(
                `Attendance server returned ${attendanceResponse.status}`
            );

        }


        // --------------------------------
        // READ JSON
        // --------------------------------

        const students =
            await studentsResponse.json();

        const attendance =
            await attendanceResponse.json();


        // --------------------------------
        // SUPPORT ARRAY OR OBJECT RESPONSE
        // --------------------------------

        const studentList =
            Array.isArray(students)
                ? students
                : (
                    Array.isArray(students.students)
                        ? students.students
                        : []
                );


        const attendanceList =
            Array.isArray(attendance)
                ? attendance
                : (
                    Array.isArray(attendance.attendance)
                        ? attendance.attendance
                        : []
                );


        // --------------------------------
        // TOTAL STUDENTS
        // --------------------------------

        const totalStudents =
            studentList.length;


        // --------------------------------
        // TODAY'S DATE
        // --------------------------------

        const today =
            new Date().toLocaleDateString();


        // --------------------------------
        // TODAY'S ATTENDANCE
        // --------------------------------

        const todayAttendance =
            attendanceList.filter(
                function (record) {

                    return (
                        record.date === today
                    );

                }
            );


        // =================================
        // PRESENT
        // =================================

        const present =
            todayAttendance.filter(
                function (record) {

                    return (
                        String(record.status)
                            .trim()
                            .toLowerCase() ===
                        "present"
                    );

                }
            ).length;


        // =================================
        // LATE
        // =================================

        const late =
            todayAttendance.filter(
                function (record) {

                    return (
                        String(record.status)
                            .trim()
                            .toLowerCase() ===
                        "late"
                    );

                }
            ).length;


        // =================================
        // ABSENT
        // =================================

        const absent =
            todayAttendance.filter(
                function (record) {

                    return (
                        String(record.status)
                            .trim()
                            .toLowerCase() ===
                        "absent"
                    );

                }
            ).length;


        // =================================
        // EXCUSED
        // =================================

        const excused =
            todayAttendance.filter(
                function (record) {

                    return (
                        String(record.status)
                            .trim()
                            .toLowerCase() ===
                        "excused"
                    );

                }
            ).length;


        // =================================
        // ATTENDED
        //
        // Present + Late
        // =================================

        const attended =
            present + late;


        // =================================
        // ATTENDANCE RATE
        // =================================

        let rate = 0;

        if (totalStudents > 0) {

            rate =
                (
                    attended /
                    totalStudents
                ) * 100;

        }

        rate =
            Number(rate).toFixed(1);


        // =================================
        // UPDATE DASHBOARD CARDS
        // =================================

        const totalStudentsElement =
            document.getElementById(
                "totalStudents"
            );

        const presentTodayElement =
            document.getElementById(
                "presentToday"
            );

        const lateTodayElement =
            document.getElementById(
                "lateToday"
            );

        const absentTodayElement =
            document.getElementById(
                "absentToday"
            );

        const excusedTodayElement =
            document.getElementById(
                "excusedToday"
            );

        const attendanceRateElement =
            document.getElementById(
                "attendanceRate"
            );


        if (totalStudentsElement) {

            totalStudentsElement.textContent =
                totalStudents;

        }


        if (presentTodayElement) {

            presentTodayElement.textContent =
                present;

        }


        if (lateTodayElement) {

            lateTodayElement.textContent =
                late;

        }


        if (absentTodayElement) {

            absentTodayElement.textContent =
                absent;

        }


        if (excusedTodayElement) {

            excusedTodayElement.textContent =
                excused;

        }


        if (attendanceRateElement) {

            attendanceRateElement.textContent =
                `${rate}%`;

        }


        // =================================
        // DRAW CHART
        //
        // IMPORTANT:
        // Present = Present only
        // Late = Late only
        // Absent = Absent only
        // =================================

        drawChart(
            present,
            late,
            absent
        );


        // =================================
        // DEBUG
        // =================================

        console.log(
            "Dashboard summary:",
            {
                totalStudents: totalStudents,
                present: present,
                late: late,
                absent: absent,
                excused: excused,
                attended: attended,
                rate: rate
            }
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ===============================
// LOAD TODAY ATTENDANCE
// ===============================

async function loadAttendance() {

    try {

        let url =
            `${API}/attendance`;


        // --------------------------------
        // TEACHER FILTER
        // --------------------------------

        if (
            currentRole === "teacher" &&
            teacherGrade &&
            teacherSection
        ) {

            url +=
                `?grade=${encodeURIComponent(
                    teacherGrade
                )}&section=${encodeURIComponent(
                    teacherSection
                )}`;

        }


        // --------------------------------
        // FETCH
        // --------------------------------

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Attendance server returned ${response.status}`
            );

        }


        const result =
            await response.json();


        // --------------------------------
        // SUPPORT ARRAY OR OBJECT
        // --------------------------------

        const attendance =
            Array.isArray(result)
                ? result
                : (
                    Array.isArray(result.attendance)
                        ? result.attendance
                        : []
                );


        // --------------------------------
        // TABLE
        // --------------------------------

        const tbody =
            document.getElementById(
                "attendanceTable"
            );


        if (!tbody) {

            return;

        }


        tbody.innerHTML = "";


        // --------------------------------
        // TODAY
        // --------------------------------

        const today =
            new Date().toLocaleDateString();


        const todayAttendance =
            attendance
                .filter(
                    function (record) {

                        return (
                            record.date === today
                        );

                    }
                )
                .reverse();


        // --------------------------------
        // NO RECORDS
        // --------------------------------

        if (
            todayAttendance.length === 0
        ) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:25px;
                        "
                    >

                        No attendance recorded today.

                    </td>

                </tr>

            `;

            return;

        }


        // --------------------------------
        // DISPLAY RECORDS
        // --------------------------------

        todayAttendance.forEach(
            function (student) {

                const studentId =
                    student.studentId ||
                    student.rfid ||
                    student.lrn ||
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


                const time =
                    student.time ||
                    "";


                const status =
                    student.status ||
                    "Present";


                const statusClass =
                    String(status)
                        .toLowerCase()
                        .trim()
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
                        ${escapeHTML(name)}
                    </td>

                    <td>
                        ${escapeHTML(grade)}
                    </td>

                    <td>
                        ${escapeHTML(section)}
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


                tbody.appendChild(row);

            }
        );

    }

    catch (error) {

        console.error(
            "Attendance loading error:",
            error
        );

    }

}


// ===============================
// DRAW ATTENDANCE CHART
// ===============================

function drawChart(
    present,
    late,
    absent
) {

    const canvas =
        document.getElementById(
            "attendanceChart"
        );


    if (!canvas) {

        console.warn(
            "#attendanceChart not found."
        );

        return;

    }


    // --------------------------------
    // FIND CONTAINER
    // --------------------------------

    const container =
        canvas.parentElement;


    // --------------------------------
    // MAKE CHART LARGE
    // --------------------------------

    if (container) {

        container.style.position =
            "relative";

        container.style.width =
            "100%";

        container.style.height =
            "430px";

        container.style.minHeight =
            "430px";

    }


    // --------------------------------
    // CANVAS SIZE
    // --------------------------------

    canvas.style.width =
        "100%";

    canvas.style.height =
        "100%";

    canvas.style.maxWidth =
        "100%";


    // --------------------------------
    // REMOVE OLD CHART
    // --------------------------------

    if (attendanceChart) {

        attendanceChart.destroy();

        attendanceChart = null;

    }


    // --------------------------------
    // CREATE NEW CHART
    // --------------------------------

    attendanceChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Present",
                        "Late",
                        "Absent"
                    ],

                    datasets: [

                        {

                            data: [
                                present,
                                late,
                                absent
                            ],

                            backgroundColor: [
                                "#22c55e",
                                "#facc15",
                                "#ef4444"
                            ],

                            borderColor:
                                "#ffffff",

                            borderWidth:
                                4,

                            hoverOffset:
                                10

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,


                    // --------------------------------
                    // DOUGHNUT SIZE
                    // --------------------------------

                    cutout:
                        "55%",


                    layout: {

                        padding: 20

                    },


                    plugins: {

                        legend: {

                            position:
                                "right",

                            labels: {

                                usePointStyle:
                                    true,

                                pointStyle:
                                    "circle",

                                padding:
                                    20,

                                font: {

                                    size:
                                        18,

                                    family:
                                        "Poppins, sans-serif",

                                    weight:
                                        "500"

                                }

                            }

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        const value =
                                            context.raw || 0;

                                        return (
                                            `${context.label}: ${value}`
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


// ===============================
// AUTO REFRESH
// ===============================

setInterval(
    function () {

        loadDashboard();

        loadAttendance();

    },
    10000
);


// ===============================
// HTML ESCAPE
// ===============================

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