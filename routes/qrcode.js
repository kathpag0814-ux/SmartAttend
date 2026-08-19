const express = require("express");
const router = express.Router();

const Student = require("../models/students");
const Attendance = require("../models/attendance");
const SystemLog = require("../models/systemlogs");

// =====================================
// GET QR CODE OF STUDENT
// GET /api/qrcode/:studentId
// =====================================

router.get("/:studentId", async (req, res) => {

    try {

        const student = await Student.findOne({

            studentId: req.params.studentId

        });

        if (!student) {

            return res.status(404).json({

                success: false,
                message: "Student not found."

            });

        }

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

// =====================================
// QR SCAN
// POST /api/qrcode/scan
// =====================================

router.post("/scan", async (req, res) => {

    try {

        const { studentId } = req.body;

        if (!studentId) {

            return res.status(400).json({

                success: false,

                message: "QR Code is empty."

            });

        }

        const student = await Student.findOne({

            studentId

        });

        if (!student) {

            await SystemLog.create({

                activity: "QR Scan Failed",

                description: `Unknown QR Code : ${studentId}`,

                status: "Failed"

            });

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }

        const today = new Date().toLocaleDateString();

        const existing = await Attendance.findOne({

            studentId,

            date: today

        });

        if (existing) {

            await SystemLog.create({

                activity: "Duplicate Attendance",

                description: `${student.name} attempted another scan.`,

                status: "Warning"

            });

            return res.json({

                success: false,

                message: "Attendance already recorded today."

            });

        }

        let status = "Present";

        const now = new Date();

        if (

            now.getHours() > 7 ||

            (now.getHours() === 7 && now.getMinutes() > 30)

        ) {

            status = "Late";

        }

        const attendance = await Attendance.create({

            studentId: student.studentId,

            name: student.name,

            grade: student.grade,

            section: student.section,

            status,

            date: today,

            time: now.toLocaleTimeString()

        });

        await SystemLog.create({

            activity: "QR Attendance",

            description: `${student.name} marked ${status}.`,

            status: "Success"

        });

        res.json({

    success: true,

    message: `${student.name} marked ${status}`,

    student: {

        studentId: student.studentId,

        name: student.name,

        grade: student.grade,

        section: student.section,

        status: status

    }

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