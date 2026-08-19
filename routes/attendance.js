const express = require("express");
const router = express.Router();

const Attendance = require("../models/attendance");
const Student = require("../models/students");
const saveSystemLog = require("../helpers/systemLogger");


// ======================================
// GET ALL ATTENDANCE
// ======================================

router.get("/", async (req, res) => {

    try {

       const { grade, section, status } = req.query;

       let filter = {};

if (grade) filter.grade = grade;
if (section) filter.section = section;

// NEW
if (status === "Present") {

    filter.status = {
        $in: ["Present", "Late"]
    };

}
else if (status && status !== "All") {

    filter.status = status;

}

const attendance = await Attendance.find(filter);

        res.json(attendance);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});


// ======================================
// QR SCAN
// ======================================

router.post("/scan", async (req, res) => {

    try {

        const { studentId } = req.body;

        const student = await Student.findOne({ studentId });

        if (!student) {

            await saveSystemLog(
                "QR Scan Failed",
                `Unknown QR scanned: ${studentId}`,
                "Failed"
            );

            return res.json({
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

            await saveSystemLog(
                "Duplicate Attendance",
                `${student.name} attempted to scan twice.`,
                "Warning"
            );

            return res.json({
                success: false,
                message: "Attendance already recorded."
            });

        }

       // ======================================
// DETERMINE STATUS
// ======================================

const now = new Date();

const hour = now.getHours();
const minute = now.getMinutes();

// Example: 7:30 AM cutoff
let status = "Present";

if (
    hour > 7 ||
    (hour === 7 && minute > 30)
) {
    status = "Late";
}

        await Attendance.create({

            studentId: student.studentId,
            name: student.name,
            grade: student.grade,
            section: student.section,

            date: today,
            time: now.toLocaleTimeString(),

            status,
            reason: ""

        });

        const io = req.app.get("io");

        if (io) io.emit("attendanceUpdated");

        await saveSystemLog(
            "QR Attendance",
            `${student.name} marked ${status}.`,
            "Success"
        );

        res.json({

    success: true,

    message: `${student.name} marked ${status}`,

    student: {

        studentId: student.studentId,
        name: student.name,
        grade: student.grade,
        section: student.section,
        status: status,

        // SEND STUDENT PHOTO
        profilePic: student.profilePic || ""

    }

    });



    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// UPDATE ATTENDANCE
// ======================================

router.put("/:id", async (req, res) => {

    try {

        const { status, reason } = req.body;

        const allowed = [
            "Present",
            "Late",
            "Absent",
            "Excused"
        ];

        if (!allowed.includes(status)) {

            return res.json({

                success: false,
                message: "Invalid attendance status."

            });

        }

        const updateData = {
            status
        };

        if (status === "Excused") {

            updateData.reason = reason || "";

        } else {

            updateData.reason = "";

        }

        const attendance = await Attendance.findByIdAndUpdate(

            req.params.id,

            updateData,

            { new: true }

        );

        if (!attendance) {

            return res.json({

                success: false,
                message: "Attendance record not found."

            });

        }

        const io = req.app.get("io");

        if (io) {

            io.emit("attendanceUpdated");

        }

        await saveSystemLog(

            "Attendance Updated",

            `${attendance.name} changed to ${status}${status === "Excused" ? ` (${reason})` : ""}.`,

            "Success"

        );

        res.json({

            success: true,

            attendance

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// DELETE ATTENDANCE
// ======================================

router.delete("/:id", async (req, res) => {

    try {

        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {

            return res.json({

                success: false,
                message: "Attendance record not found."

            });

        }

        await Attendance.findByIdAndDelete(req.params.id);

        const io = req.app.get("io");

        if (io) {

            io.emit("attendanceUpdated");

        }

        await saveSystemLog(

            "Attendance Deleted",

            `${attendance.name}'s attendance record was deleted.`,

            "Success"

        );

        res.json({

            success: true,
            message: "Attendance deleted."

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