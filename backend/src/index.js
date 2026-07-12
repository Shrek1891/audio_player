import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/songs.route.js";
import albumRoutes from "./routes/albums.route.js";
import statisticsRoutes from "./routes/statistics.route.js";
import {connectDB} from "./lib/db.js";
import {clerkMiddleware} from "@clerk/express";
import * as path from "node:path";
import fileUpload from "express-fileupload";
import {createServer} from "node:http";
import {initializeSocket} from "./lib/socket.js";
import cron from "node-cron";
import fs from "node:fs";



dotenv.config()
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app)
initializeSocket(httpServer)

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(clerkMiddleware(
    {
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

    }
))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {fileSize: 20 * 1024 * 1024},
}))

// cron jobs
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
    if (fs.existsSync(tempDir)) {
        fs.readdir(tempDir, (err, files) => {
            if (err) {
                console.log("error", err);
                return;
            }
            for (const file of files) {
                fs.unlink(path.join(tempDir, file), (err) => {
                });
            }
        });
    }
});

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/songs", songRoutes)
app.use("/api/albums", albumRoutes)
app.use("/api/statistics", statisticsRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}


app.use((err, req, res, next) => {
    res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message})
})

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()

})