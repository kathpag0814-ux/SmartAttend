const express = require("express");
const router = express.Router();

const Attendance = require("../models/attendance");

// =====================================
// GET REPORTS (WITH GRADE & SECTION FILTER)
// =====================================
router.get("/", async (req, res) => {

    try {

        const { grade, section } = req.query;

        let filter = {};

        if (grade) {
            filter.grade = grade;
        }

        if (section) {
            filter.section = section;
        }

        const reports = await Attendance.find(filter).sort({
            createdAt: -1
        });

        const total = reports.length;

        const present = reports.filter(r => r.status === "Present").length;

        const late = reports.filter(r => r.status === "Late").length;

        const absent = reports.filter(r => r.status === "Absent").length;

        res.json({

            success: true,

            reports,

            summary: {

                total,
                present,
                late,
                absent

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

// =====================================
// TODAY'S REPORT
// =====================================
router.get("/today", async (req, res) => {

    try {

        const today = new Date().toLocaleDateString();

        const reports = await Attendance.find({

            date: today

        });

        res.json({

            success: true,
            reports

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
// DELETE REPORT
// =====================================
router.delete("/:id", async (req, res) => {

    try {

        await Attendance.findByIdAndDelete(req.params.id);

        res.json({

            success: true,
            message: "Attendance record deleted."

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