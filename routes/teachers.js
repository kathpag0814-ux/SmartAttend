const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/users");

// =======================================
// GET ALL TEACHERS
// =======================================
router.get("/", async (req, res) => {

    try {

        const teachers = await User.find({
            role: "Teacher"
        }).sort({
            fullName: 1
        });

        res.json(teachers);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// =======================================
// ADD TEACHER
// =======================================
router.post("/", async (req, res) => {

    try {

        const {

            fullName,
            username,
            password,
            grade,
            section

        } = req.body;

        const exist = await User.findOne({
            username
        });

        if (exist) {

            return res.json({

                success: false,

                message: "Username already exists."

            });

        }

        const hash = await bcrypt.hash(password, 10);

        await User.create({

            fullName,
            username,
            password: hash,
            role: "Teacher",
            grade,
            section

        });

        res.json({

            success: true,

            message: "Teacher added successfully."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// =======================================
// UPDATE TEACHER
// =======================================

router.put("/:id", async (req, res) => {

    try {

        const {

            fullName,
            username,
            password,
            grade,
            section

        } = req.body;

        const updateData = {

            fullName,
            username,
            grade,
            section

        };

        // Update password only if a new one is entered
        if (password && password.trim() !== "") {

            updateData.password = await bcrypt.hash(password, 10);

        }

        await User.findByIdAndUpdate(

            req.params.id,

            updateData

        );

        res.json({

            success: true,

            message: "Teacher updated successfully."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// =======================================
// DELETE TEACHER
// =======================================
router.delete("/:id", async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Teacher deleted."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;