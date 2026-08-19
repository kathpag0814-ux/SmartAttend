const express = require("express");
const router = express.Router();

const Student = require("../models/students");
const SystemLog = require("../models/systemlogs");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");


// ======================================
// GET STUDENTS
// ======================================

router.get("/", async (req, res) => {

    try {

        const token =
            req.headers.authorization?.split(" ")[1];

        let filter = {};

        // ==================================
        // CHECK LOGGED-IN TEACHER
        // ==================================

        if (token) {

            try {

                const jwt = require("jsonwebtoken");

                const decoded = jwt.verify(
                    token,
                    "smartattendsecret"
                );

                const role =
                    (decoded.role || "").toLowerCase();

                console.log("Students request role:", role);

                // ==================================
                // TEACHER
                // ==================================

                if (role === "teacher") {

                    console.log(
                        "Teacher assignment:",
                        decoded.grade,
                        decoded.section
                    );

                    // Teacher MUST have assignment
                    if (
                        !decoded.grade ||
                        !decoded.section
                    ) {

                        return res.status(403).json({

                            success: false,

                            message:
                                "Teacher has no assigned grade or section."

                        });

                    }

                    // IMPORTANT:
                    // Ignore whatever grade/section
                    // the browser sends.
                    //
                    // Use the assignment stored
                    // inside the login token.

                    filter.grade =
                        decoded.grade;

                    filter.section =
                        decoded.section;

                }

                // ==================================
                // ADMIN
                // ==================================

                else {

                    if (req.query.grade) {

                        filter.grade =
                            req.query.grade;

                    }

                    if (req.query.section) {

                        filter.section =
                            req.query.section;

                    }

                }

            }

            catch (tokenError) {

                console.log(
                    "Invalid token:",
                    tokenError.message
                );

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid or expired login session."

                });

            }

        }

        // ==================================
        // NO TOKEN
        // ==================================

        else {

            // Allow normal filtering for now
            // for pages that don't send token.

            if (req.query.grade) {

                filter.grade =
                    req.query.grade;

            }

            if (req.query.section) {

                filter.section =
                    req.query.section;

            }

        }

        // ==================================
        // STATUS
        // ==================================

        const status =
            req.query.status;

        if (
            status &&
            status !== "All"
        ) {

            filter.status = status;

        }
        else {

            filter.status = {
                $ne: "Graduated"
            };

        }

        console.log(
            "Student database filter:",
            filter
        );

        // ==================================
        // GET STUDENTS
        // ==================================

        const students =
            await Student.find(filter);

        console.log(
            "Students returned:",
            students.length
        );

        res.json(students);

    }

    catch (err) {

        console.error(
            "GET STUDENTS ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});
// ======================================
// REGISTER STUDENT
// ======================================

router.post("/", async (req, res) => {

    try {

        const {
            studentId,
            name,
            grade,
            section,
            photo
        } = req.body;

        console.log("PHOTO RECEIVED:", photo ? "YES" : "NO");

        if (
            !studentId ||
            !name ||
            !grade ||
            !section
        ) {

            return res.status(400).json({

                success: false,

                message: "Please complete all fields."

            });

        }

        // Check Student ID

        const existing = await Student.findOne({

            studentId

        });

        if (existing) {

            return res.json({

                success: false,

                message: "Student ID already exists."

            });

        }

       // Save Student First

const student = await Student.create({

    studentId,
    name,
    grade,
    section,
    profilePic: photo || ""

});

// Create QR Folder if it doesn't exist

const qrFolder = path.join(__dirname, "../public/qr");

if (!fs.existsSync(qrFolder)) {

    fs.mkdirSync(qrFolder);

}

// QR Image Path

const qrImage = `${student.studentId}.png`;

const qrPath = path.join(qrFolder, qrImage);

// Generate QR Code Image

await QRCode.toFile(qrPath, student.studentId);

// Save QR Path

student.qrCode = `/qr/${qrImage}`;

await student.save();
// Save System Log
await SystemLog.create({

    activity: "Student Registration",

    description: `${student.name} was registered.`,

    status: "Success"

});

res.json({

    success: true,

    message: "Student Registered Successfully",

    student,

    qrCode: student.qrCode

});
    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ======================================
// UPDATE STUDENT
// ======================================

router.put("/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true

            }

        );
await SystemLog.create({

    activity: "Student Updated",

    description: `${student.name} information was updated.`,

    status: "Success"

});

res.json({

    success: true,

    student

});
    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ======================================
// DELETE STUDENT
// ======================================

router.delete("/:id", async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }

        await Student.findByIdAndDelete(req.params.id);

        await SystemLog.create({

            activity: "Student Deleted",

            description: `${student.name} was deleted.`,

            status: "Success"

        });

        res.json({

            success: true,

            message: "Student Deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});



module.exports = router;