const express = require("express");
const router = express.Router();

const Student = require("../models/students");
const Attendance = require("../models/attendance");

// ======================================
// DASHBOARD SUMMARY
// ======================================
router.get("/", async (req, res) => {

    try {

        // Total Registered Students
        const totalStudents = await Student.countDocuments();

        // Today's Date
        const today = new Date().toLocaleDateString();

        // Students who attended today (Present + Late)
        const presentToday = await Attendance.countDocuments({
            date: today,
            status: { $in: ["Present", "Late"] }
        });

        // Late students only
        const lateToday = await Attendance.countDocuments({
            date: today,
            status: "Late"
        });

        // Excused students
        const excusedToday = await Attendance.countDocuments({
            date: today,
            status: "Excused"
        });

        // Absent students
        const absentToday = totalStudents - presentToday - excusedToday;

        // Attendance Rate
        const attendanceRate =
            totalStudents > 0
                ? ((presentToday / totalStudents) * 100).toFixed(1)
                : "0.0";

        // Latest Attendance Record
        const lastStudent = await Attendance.findOne().sort({ _id: -1 });

        res.json({

            success: true,

            totalStudents,

            presentToday,

            lateToday,

            excusedToday,

            absentToday,

            attendanceRate,

            lastStudent

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;