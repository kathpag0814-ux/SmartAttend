console.log("QR CODE PAGE");

// ==========================================
// API
// ==========================================
const API = "/api";

// ==========================================
// ELEMENTS
// ==========================================
const result = document.getElementById("result");

const profilePic =
    document.getElementById("scannedProfilePic");

const studentName =
    document.getElementById("scannedStudentName");

const studentId =
    document.getElementById("scannedStudentId");

const studentGrade =
    document.getElementById("scannedGrade");

const studentSection =
    document.getElementById("scannedSection");

const studentStatus =
    document.getElementById("scannedStatus");

const scanStatusText =
    document.getElementById("scanStatusText");

// ==========================================
// SOUNDS
// ==========================================
const successSound =
    new Audio("/sounds/success.mp3");

const errorSound =
    new Audio("/sounds/error.mp3");

// ==========================================
// QR SCANNER
// ==========================================
const html5QrCode =
    new Html5Qrcode("reader");

let scanning = false;

// ==========================================
// DEFAULT PROFILE
// ==========================================
const DEFAULT_PROFILE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="300"
             height="300"
             viewBox="0 0 300 300">

            <rect width="300"
                  height="300"
                  fill="#f1f5e8"/>

            <circle cx="150"
                    cy="110"
                    r="55"
                    fill="#6b941d"/>

            <circle cx="150"
                    cy="110"
                    r="35"
                    fill="#f1f5e8"/>

            <path
                d="M70 260
                   C70 205 105 175 150 175
                   C195 175 230 205 230 260"
                fill="#6b941d"/>

            <text
                x="150"
                y="285"
                text-anchor="middle"
                font-size="20"
                fill="#34451f">
                Student
            </text>

        </svg>
    `);

// ==========================================
// INITIAL STATE
// ==========================================
function showWaiting() {

    if (profilePic) {
        profilePic.src = DEFAULT_PROFILE;
    }

    if (studentName) {
        studentName.textContent =
            "Waiting for Student";
    }

    if (studentId) {
        studentId.textContent = "---";
    }

    if (studentGrade) {
        studentGrade.textContent = "---";
    }

    if (studentSection) {
        studentSection.textContent = "---";
    }

    if (studentStatus) {
        studentStatus.textContent =
            "Waiting...";
    }

    if (scanStatusText) {
        scanStatusText.textContent =
            "Waiting for QR Code...";
    }
}

// ==========================================
// DISPLAY STUDENT
// ==========================================
function displayStudent(student) {

    console.log(
        "STUDENT RECEIVED:",
        student
    );

    if (!student) {
        return;
    }

    const name =
        student.name ||
        student.studentName ||
        student.fullName ||
        "Unknown Student";

    const id =
        student.studentId ||
        student.rfid ||
        student.lrn ||
        "";

    const grade =
        student.grade ||
        "";

    const section =
        student.section ||
        "";

    const status =
        student.status ||
        "Active";

    // -------------------------------
    // PROFILE PICTURE
    // -------------------------------
    let image =
        student.profilePic;

    if (
        !image ||
        typeof image !== "string"
    ) {

        image =
            DEFAULT_PROFILE;

    }

    console.log(
        "PROFILE IMAGE:",
        image
    );

    // -------------------------------
    // UPDATE EXISTING CARD
    // -------------------------------

    if (profilePic) {

        profilePic.src =
            image;

        profilePic.onerror =
            function () {

                console.warn(
                    "Profile picture failed."
                );

                this.src =
                    DEFAULT_PROFILE;

            };

    }

    if (studentName) {
        studentName.textContent =
            name;
    }

    if (studentId) {
        studentId.textContent =
            id;
    }

    if (studentGrade) {
        studentGrade.textContent =
            grade;
    }

    if (studentSection) {
        studentSection.textContent =
            section;
    }

    if (studentStatus) {
        studentStatus.textContent =
            status;
    }

    if (scanStatusText) {
        scanStatusText.textContent =
            "Attendance Recorded";
    }
}

// ==========================================
// SCAN SUCCESS
// ==========================================
async function onScanSuccess(decodedText) {

    console.log(
        "QR SCANNED:",
        decodedText
    );

    if (scanning) {
        return;
    }

    scanning = true;

    try {

        const response =
            await fetch(
                `${API}/attendance/scan`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        studentId:
                            decodedText.trim()
                    })

                }
            );

        console.log(
            "HTTP STATUS:",
            response.status
        );

        const data =
            await response.json();

        console.log(
            "SERVER RESPONSE:",
            data
        );

        // ==================================
        // SUCCESS
        // ==================================
        if (
            response.ok &&
            data.success &&
            data.student
        ) {

            successSound.currentTime =
                0;

            successSound
                .play()
                .catch(() => {});

            displayStudent(
                data.student
            );

        }

        // ==================================
        // ERROR
        // ==================================
        else {

            errorSound.currentTime =
                0;

            errorSound
                .play()
                .catch(() => {});

            if (studentName) {

                studentName.textContent =
                    "Student Not Found";

            }

            if (studentId) {
                studentId.textContent =
                    decodedText;
            }

            if (studentGrade) {
                studentGrade.textContent =
                    "---";
            }

            if (studentSection) {
                studentSection.textContent =
                    "---";
            }

            if (studentStatus) {
                studentStatus.textContent =
                    "Error";
            }

            if (scanStatusText) {

                scanStatusText.textContent =
                    data.message ||
                    "Student not found.";

            }

        }

    }

    catch (error) {

        console.error(
            "SCAN ERROR:",
            error
        );

        errorSound.currentTime =
            0;

        errorSound
            .play()
            .catch(() => {});

        if (studentName) {

            studentName.textContent =
                "Connection Error";

        }

        if (scanStatusText) {

            scanStatusText.textContent =
                "Cannot connect to server.";

        }

    }

    // ==================================
    // ALLOW NEXT SCAN
    // ==================================
    setTimeout(
        function () {

            scanning = false;

            showWaiting();

        },
        10000
    );
}

// ==========================================
// START CAMERA
// ==========================================
async function startScanner() {

    try {

        const cameras =
            await Html5Qrcode.getCameras();

        if (
            !cameras ||
            cameras.length === 0
        ) {

            console.error(
                "No camera found."
            );

            return;

        }

        await html5QrCode.start(

            {
                facingMode:
                    "environment"
            },

            {
                fps: 10,

                qrbox: {
                    width: 220,
                    height: 220
                },

                aspectRatio: 1.0

            },

            onScanSuccess,

            function () {
                // Ignore scan errors
            }

        );

        console.log(
            "QR scanner started."
        );

    }

    catch (error) {

        console.error(
            "CAMERA ERROR:",
            error
        );

    }
}

// ==========================================
// PAGE LOAD
// ==========================================
document.addEventListener(
    "DOMContentLoaded",
    function () {

        showWaiting();

        startScanner();

    }
);