import express from "express";
import "dotenv/config";
import studentRoutes from "./routes/student.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import academicRoutes from "./routes/academic.routes.js";
import projectRoutes from "./routes/project.routes.js";
import certificationRoutes from "./routes/certification.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});