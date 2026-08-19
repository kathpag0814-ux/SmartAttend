require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// ======================
// Create Express App
// ======================
const app = express();

// ======================
// Create HTTP Server
// ======================
const server = http.createServer(app);

// ======================
// Socket.IO
// ======================
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set("io", io);

io.on("connection", (socket) => {

    console.log("🟢 Client Connected");

    socket.on("disconnect", () => {

        console.log("🔴 Client Disconnected");

    });

});

// ======================
// Middleware
// ======================
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use(express.static(path.join(__dirname, "public")));

// ======================
// Routes
// ======================
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/students", require("./routes/students"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/qrcode", require("./routes/qrcode"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/systemlogs", require("./routes/systemlogs"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/schoolyear", require("./routes/schoolyear"));

// ======================
// MongoDB Atlas
// ======================

const MONGODB_URI =
    process.env.MONGODB_URI;

if (!MONGODB_URI) {

    console.error(
        "❌ MONGODB_URI is not defined in environment variables."
    );

} else {

    console.log("MongoDB URI loaded.");

    mongoose.connect(MONGODB_URI)

        .then(() => {

            console.log(
                "✅ MongoDB Atlas Connected Successfully"
            );

        })

        .catch((err) => {

            console.error(
                "❌ MongoDB Connection Error"
            );

            console.error(err);

        });

}

// ======================
// Home Page
// ======================
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "login.html"));

});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 3000;

if (require.main === module) {

    server.listen(PORT, () => {

        console.log("");
        console.log("====================================");
        console.log(" SmartAttend Server Running");
        console.log(` http://localhost:${PORT}`);
        console.log("====================================");
        console.log("");

    });

}

module.exports = app;