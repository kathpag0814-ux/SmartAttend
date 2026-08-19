const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // =====================================
        // USER INFORMATION
        // =====================================

        fullName: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            default: "Teacher"
        },

        // =====================================
        // TEACHER ASSIGNMENT
        // =====================================

        grade: {
            type: String,
            default: ""
        },

        section: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);