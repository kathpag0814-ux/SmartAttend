require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/users");

async function createAdmin() {

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully.");

        const hashedPassword = await bcrypt.hash("marolinja2876$", 10);

        const admin = await User.findOneAndUpdate(
            { username: "Jamaronel" },
            {
                fullName: "Ronel Jamarolin",
                username: "Jamaronel",
                password: hashedPassword,
                role: "Admin",
                grade: "",
                section: ""
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );

        console.log("");
        console.log("==============================");
        console.log("ADMIN ACCOUNT READY");
        console.log("==============================");
        console.log("Username: " + admin.username);
        console.log("Password: marolinja2876$");
        console.log("Role: " + admin.role);
        console.log("==============================");

        await mongoose.disconnect();

    } catch (error) {

        console.error("");
        console.error("ERROR:");
        console.error(error);

        process.exit(1);
    }
}

createAdmin();