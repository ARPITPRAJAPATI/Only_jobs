import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import authRoutes from "./auth/routes/auth.routes.js";
import apiRoutes from "./routes/api.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Global middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "JobsOnly Backend is running",
    });
});

// Public authentication routes
app.use("/api/auth", authRoutes);

// Centralized protected API routes
app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});