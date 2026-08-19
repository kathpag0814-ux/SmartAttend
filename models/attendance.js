const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    grade: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Present", "Late", "Absent", "Excused"],
        default: "Present"
    },

    // NEW FIELD
    reason: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Attendance", attendanceSchema);