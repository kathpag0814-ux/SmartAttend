const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const JWT_SECRET =
    process.env.JWT_SECRET || "smartattendsecret";


// ======================================
// REGISTER USER
// ======================================
router.post("/register", async (req, res) => {
    try {
        const {
            fullName,
            username,
            password,
            role,
            grade,
            section
        } = req.body;

        // Check required fields
        if (!fullName || !username || !password) {
            return res.json({
                success: false,
                message: "Full name, username, and password are required."
            });
        }

        // Remove extra spaces
        const cleanUsername = username.trim();

        // Check if username already exists
        const existing = await User.findOne({
            username: {
                $regex: `^${cleanUsername}$`,
                $options: "i"
            }
        });

        if (existing) {
            return res.json({
                success: false,
                message: "Username already exists."
            });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            fullName: fullName.trim(),
            username: cleanUsername,
            password: hash,
            role: role || "Admin",
            grade: grade || "",
            section: section || ""
        });

        res.json({
            success: true,
            message: "User registered successfully."
        });
    }

    catch (err) {
        console.error("REGISTER ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ======================================
// LOGIN
// ======================================
router.post("/login", async (req, res) => {

    try {

        const username = String(req.body.username || "").trim();
        const password = String(req.body.password || "");

        console.log("================================");
        console.log("LOGIN ATTEMPT");
        console.log("Username:", username);
        console.log("================================");

        if (!username || !password) {

            return res.json({
                success: false,
                message: "Username and password are required."
            });

        }

        // Find user case-insensitively
        const user = await User.findOne({
            username: {
                $regex: `^${username}$`,
                $options: "i"
            }
        });

        console.log("User found:", !!user);

        if (!user) {

            console.log("INVALID USERNAME:", username);

            return res.json({
                success: false,
                message: "Invalid Username"
            });

        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password match:", passwordMatch);

        if (!passwordMatch) {

            console.log("INVALID PASSWORD");

            return res.json({
                success: false,
                message: "Invalid Password"
            });

        }

        // Create token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                grade: user.grade || "",
                section: user.section || ""
            },
            JWT_SECRET
        );

        console.log("LOGIN SUCCESS:", user.username);

        return res.json({

            success: true,

            message: "Login successful.",

            token: token,

            role: user.role,

            fullName: user.fullName,

            username: user.username,

            grade: user.grade || "",

            section: user.section || ""

        });

    }

    catch (err) {

        console.error("LOGIN ERROR:", err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

});
// ======================================
// CHANGE PASSWORD
// ======================================
router.put("/change-password", async (req, res) => {
    try {
        // Get token
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found."
            });
        }

        const {
            currentPassword,
            newPassword
        } = req.body;

        // Check fields
        if (!currentPassword || !newPassword) {
            return res.json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        // Check current password
        const match = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!match) {
            return res.json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Save new password
        user.password = hashedPassword;

        await user.save();

        res.json({
            success: true,
            message: "Password updated successfully."
        });
    }

    catch (err) {
        console.error("CHANGE PASSWORD ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ======================================
// GET CURRENT USER
// ======================================
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user: user
        });
    }

    catch (err) {
        console.error("GET USER ERROR:", err);

        res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
});


// ======================================
// EXPORT ROUTER
// ======================================
module.exports = router;