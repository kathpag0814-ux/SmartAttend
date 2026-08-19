// ==========================================
// SMARTATTEND QR SCANNER
// qrscanner.js
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("====================================");
    console.log("SmartAttend QR Scanner loaded.");
    console.log("====================================");

    // ==========================================
    // API
    // ==========================================

    const API = "http://localhost:3000/api";

    console.log("QR Scanner API:", API);

    // ==========================================
    // ELEMENTS
    // ==========================================

    const reader = document.getElementById("reader");
    const result = document.getElementById("result");

    if (!reader) {

        console.error("#reader not found.");

        return;
    }

    if (!result) {

        console.error("#result not found.");

        return;
    }

    // ==========================================
    // SOUNDS
    // ==========================================

    const successSound =
        new Audio("/sounds/success.mp3");

    const errorSound =
        new Audio("/sounds/error.mp3");

    successSound.preload = "auto";
    errorSound.preload = "auto";


    function playSuccessSound() {

        successSound.currentTime = 0;

        successSound.play().catch(error => {

            console.warn(
                "Success sound blocked:",
                error
            );

        });

    }


    function playErrorSound() {

        errorSound.currentTime = 0;

        errorSound.play().catch(error => {

            console.warn(
                "Error sound blocked:",
                error
            );

        });

    }


    // ==========================================
    // CHECK QR LIBRARY
    // ==========================================

    if (typeof Html5Qrcode === "undefined") {

        console.error(
            "Html5Qrcode library NOT loaded."
        );

        result.innerHTML = `

            <div class="error-box">

                <h2>
                    ❌ QR Scanner Library Not Loaded
                </h2>

                <p>
                    Please check your Html5Qrcode script.
                </p>

            </div>

        `;

        return;
    }


    // ==========================================
    // CREATE SCANNER
    // ==========================================

    const scanner =
        new Html5Qrcode("reader");

    let processing = false;


    // ==========================================
    // QR SCANNED
    // ==========================================

    async function onScanSuccess(decodedText) {

        console.log("====================================");

        console.log(
            "QR CODE DETECTED:",
            decodedText
        );

        console.log("====================================");


        // ==========================================
        // PREVENT DUPLICATE SCANS
        // ==========================================

        if (processing) {

            console.log(
                "Scan ignored - already processing."
            );

            return;
        }

        processing = true;


        try {

            // ======================================
            // CLEAN QR VALUE
            // ======================================

            const scannedId =
                String(decodedText || "").trim();


            if (!scannedId) {

                throw new Error(
                    "QR code contains no student ID."
                );

            }


            console.log(
                "Student ID:",
                scannedId
            );


            // ======================================
            // API URL
            // ======================================

            const scanURL =
                `${API}/attendance/scan`;


            console.log(
                "Sending attendance request to:",
                scanURL
            );


            // ======================================
            // SEND TO BACKEND
            // ======================================

            const response =
                await fetch(
                    scanURL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            studentId:
                                scannedId

                        })
                    }
                );


            // ======================================
            // HTTP STATUS
            // ======================================

            console.log(
                "HTTP STATUS:",
                response.status
            );


            // ======================================
            // READ SERVER RESPONSE
            // ======================================

            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            let data = {};


            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                data =
                    await response.json();

            }

            else {

                const text =
                    await response.text();

                console.error(
                    "Server returned non-JSON response:",
                    text
                );

                throw new Error(
                    `Server returned an invalid response. HTTP ${response.status}`
                );

            }


            console.log(
                "SERVER RESPONSE:",
                data
            );


            // ======================================
            // SUCCESS
            // ======================================

            if (
                response.ok &&
                data.success &&
                data.student
            ) {

                console.log(
                    "ATTENDANCE SUCCESS"
                );


                playSuccessSound();


                const student =
                    data.student;


                // ==================================
                // STUDENT INFORMATION
                // ==================================

                const studentName =
                    student.name ||
                    student.studentName ||
                    student.fullName ||
                    "Unknown Student";


                const studentId =
                    student.studentId ||
                    student.lrn ||
                    student.rfid ||
                    scannedId;


                const grade =
                    student.grade ||
                    student.gradeLevel ||
                    "";


                const section =
                    student.section ||
                    student.sectionName ||
                    "";


                const status =
                    student.status ||
                    "Active";


                const profilePic =
                    student.photo ||
                    student.profilePic ||
                    student.profilePhoto ||
                    student.photoUrl ||
                    "";


                // ==================================
                // DISPLAY SUCCESS
                // ==================================

                result.innerHTML = `

                    <div class="success-box student-scan-card">

                        ${
                            profilePic
                                ? `

                                    <img
                                        src="${escapeHTML(profilePic)}"
                                        class="scan-profile-pic"
                                        alt="Student Profile"
                                        onerror="this.style.display='none';"
                                    >

                                  `
                                : ""
                        }


                        <div class="attendance-title">

                            ✓ ATTENDANCE RECORDED

                        </div>


                        <h2 class="scan-student-name">

                            ${escapeHTML(studentName)}

                        </h2>


                        <div class="scan-student-info">


                            <div class="info-row">

                                <span>
                                    LRN
                                </span>

                                <strong>
                                    ${escapeHTML(studentId)}
                                </strong>

                            </div>


                            <div class="info-row">

                                <span>
                                    Grade
                                </span>

                                <strong>
                                    ${escapeHTML(grade)}
                                </strong>

                            </div>


                            <div class="info-row">

                                <span>
                                    Section
                                </span>

                                <strong>
                                    ${escapeHTML(section)}
                                </strong>

                            </div>


                            <div class="info-row">

                                <span>
                                    Status
                                </span>

                                <strong>
                                    ${escapeHTML(status)}
                                </strong>

                            </div>


                        </div>


                    </div>

                `;

            }


            // ======================================
            // SERVER ERROR
            // ======================================

            else {

                console.error(
                    "ATTENDANCE FAILED:",
                    data
                );


                playErrorSound();


                result.innerHTML = `

                    <div class="error-box">

                        <h2>

                            ❌
                            ${escapeHTML(
                                data.message ||
                                "Student not found."
                            )}

                        </h2>


                        <p>

                            Scanned ID:

                            <strong>
                                ${escapeHTML(scannedId)}
                            </strong>

                        </p>

                    </div>

                `;

            }

        }


        // ==========================================
        // FETCH ERROR
        // ==========================================

        catch (error) {

            console.error(
                "FETCH ERROR:",
                error
            );


            playErrorSound();


            result.innerHTML = `

                <div class="error-box">

                    <h2>
                        ❌ Cannot connect to server
                    </h2>


                    <p>

                        ${escapeHTML(
                            error.message ||
                            "Unknown error"
                        )}

                    </p>


                    <p>

                        <strong>
                            API:
                        </strong>

                        ${escapeHTML(
                            `${API}/attendance/scan`
                        )}

                    </p>

                </div>

            `;

        }


        // ==========================================
        // READY FOR NEXT SCAN
        // ==========================================

        setTimeout(
            function () {

                processing = false;

                console.log(
                    "Scanner ready for next scan."
                );

            },
            1500
        );

    }


    // ==========================================
    // SCAN FAILURE
    // ==========================================

    function onScanFailure(errorMessage) {

        // Intentionally empty.
        //
        // QR scanning continuously checks
        // the camera, so scan failures are
        // normal when no QR is visible.

    }


    // ==========================================
    // FIND BEST CAMERA
    // ==========================================

    function selectBestCamera(cameras) {

        if (!Array.isArray(cameras)) {

            return null;

        }


        if (cameras.length === 0) {

            return null;

        }


        console.log(
            "Available cameras:",
            cameras
        );


        // ======================================
        // FIND REAR CAMERA
        // ======================================

        const rearCamera =
            cameras.find(camera => {

                const label =
                    String(
                        camera.label || ""
                    ).toLowerCase();


                return (

                    label.includes("back") ||

                    label.includes("rear") ||

                    label.includes("environment") ||

                    label.includes("main")

                );

            });


        if (rearCamera) {

            console.log(
                "Rear camera selected:",
                rearCamera
            );


            return rearCamera.id;

        }


        // ======================================
        // USE FIRST CAMERA
        // ======================================

        console.log(
            "No rear camera detected."
        );


        console.log(
            "Using first available camera."
        );


        return cameras[0].id;

    }


    // ==========================================
    // START CAMERA
    // ==========================================

    try {

        console.log(
            "Checking available cameras..."
        );


        const cameras =
            await Html5Qrcode.getCameras();


        console.log(
            "CAMERAS:",
            cameras
        );


        if (
            !cameras ||
            cameras.length === 0
        ) {

            result.innerHTML = `

                <div class="error-box">

                    <h2>
                        ❌ No Camera Found
                    </h2>

                    <p>
                        Please allow camera access
                        and try again.
                    </p>

                </div>

            `;

            return;

        }


        // ======================================
        // SELECT CAMERA
        // ======================================

        const cameraId =
            selectBestCamera(cameras);


        if (!cameraId) {

            throw new Error(
                "Unable to select a camera."
            );

        }


        console.log(
            "Using camera ID:",
            cameraId
        );


        // ======================================
        // START SCANNER
        // ======================================

        await scanner.start(

            cameraId,

            {

                // Frames per second
                fps: 20,


                // ==================================
                // QR BOX
                // ==================================

                qrbox: function (
                    viewfinderWidth,
                    viewfinderHeight
                ) {

                    const minDimension =
                        Math.min(
                            viewfinderWidth,
                            viewfinderHeight
                        );


                    const boxSize =
                        Math.floor(
                            minDimension * 0.70
                        );


                    return {

                        width:
                            boxSize,

                        height:
                            boxSize

                    };

                },


                aspectRatio: 1.0,


                disableFlip: false

            },


            onScanSuccess,

            onScanFailure

        );


        // ======================================
        // CAMERA STARTED
        // ======================================

        console.log(
            "===================================="
        );


        console.log(
            "QR CAMERA STARTED SUCCESSFULLY"
        );


        console.log(
            "===================================="
        );


        result.innerHTML = `

            <div class="scanner-ready">

                <h3>
                    📷 Scanner Ready
                </h3>


                <p>
                    Place the entire QR code
                    inside the scanning box.
                </p>


                <p>
                    Move the camera slowly
                    until the QR is detected.
                </p>

            </div>

        `;

    }


    // ==========================================
    // CAMERA ERROR
    // ==========================================

    catch (error) {

        console.error(
            "CAMERA ERROR:",
            error
        );


        result.innerHTML = `

            <div class="error-box">

                <h2>
                    ❌ Unable to Access Camera
                </h2>


                <p>

                    ${escapeHTML(
                        error.message ||
                        error
                    )}

                </p>

            </div>

        `;

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

});