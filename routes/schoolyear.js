const express = require("express");
const router = express.Router();

const SchoolYear = require("../models/schoolyear");
const Student = require("../models/students");

// ================================
// GET ALL SCHOOL YEARS
// ================================
router.get("/", async (req, res) => {

    try {

        const years = await SchoolYear.find().sort({ createdAt: -1 });

        res.json(years);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ================================
// ADD SCHOOL YEAR
// ================================
router.post("/", async (req, res) => {

    try {

        const { schoolYear } = req.body;

        const exists = await SchoolYear.findOne({ schoolYear });

        if (exists) {

            return res.json({
                success: false,
                message: "School Year already exists."
            });

        }

        await SchoolYear.create({
            schoolYear,
            active: false
        });

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ================================
// SET ACTIVE SCHOOL YEAR
// ================================
router.put("/:id", async (req, res) => {

    try {

        await SchoolYear.updateMany({}, {
            active: false
        });

        await SchoolYear.findByIdAndUpdate(
            req.params.id,
            {
                active: true
            }
        );

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ================================
// PROMOTE STUDENTS
// ================================
router.post("/promote", async (req, res) => {

    try {

        const activeYear = await SchoolYear.findOne({
            active: true
        });

        if (!activeYear) {

            return res.json({
                success: false,
                message: "No active school year."
            });

        }

        const students = await Student.find({
            status: {
                $ne: "Graduated"
            }
        });

        for (const student of students) {

            switch (student.grade) {

                case "Grade 7":
                    student.grade = "Grade 8";
                    break;

                case "Grade 8":
                    student.grade = "Grade 9";
                    break;

                case "Grade 9":
                    student.grade = "Grade 10";
                    break;

                case "Grade 10":
                    student.grade = "Grade 11";
                    break;

                case "Grade 11":
                    student.grade = "Grade 12";
                    break;

                case "Grade 12":
                    student.status = "Graduated";
                    break;

            }

            student.schoolYear = activeYear.schoolYear;

            await student.save();

        }

        res.json({
            success: true,
            message: "Students promoted successfully."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

module.exports = router;