import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import studentRoutes from "./routes/student.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import academicRoutes from "./routes/academic.routes.js";
import projectRoutes from "./routes/project.routes.js";
import certificationRoutes from "./routes/certification.routes.js";
import badgeRoutes from "./routes/badge.routes.js";
import authRoutes from "./auth/routes/auth.routes.js";
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "OnlyJobs Backend is running 🚀",
    });
});

// Student routes
app.use("/api/students", studentRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/academics", academicRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/auth", authRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
