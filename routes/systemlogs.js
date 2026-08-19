const express = require("express");
const router = express.Router();

const SystemLog = require("../models/systemlogs");

// ======================================
// GET ALL SYSTEM LOGS
// ======================================
router.get("/", async (req, res) => {

    try {

        const logs = await SystemLog.find().sort({
            createdAt: -1
        });

        res.json(logs);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ======================================
// DELETE ONE LOG
// ======================================
router.delete("/:id", async (req, res) => {

    try {

        const log = await SystemLog.findByIdAndDelete(req.params.id);

        if (!log) {

            return res.status(404).json({
                success: false,
                message: "Log not found."
            });

        }

        res.json({
            success: true,
            message: "Log deleted successfully."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ======================================
// DELETE ALL LOGS (OPTIONAL)
// ======================================
router.delete("/", async (req, res) => {

    try {

        await SystemLog.deleteMany({});

        res.json({
            success: true,
            message: "All logs deleted successfully."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

module.exports = router;