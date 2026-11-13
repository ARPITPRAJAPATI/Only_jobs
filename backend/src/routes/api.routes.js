import { Router } from "express";

import { authenticateUser } from "../auth/middlewares/auth.middleware.js";

import userRoutes from "./user.routes.js";
import staffRoutes from "./staff.routes.js";
import studentRoutes from "./student.routes.js";

import profileRoutes from "./profile.routes.js";
import academicRoutes from "./academic.routes.js";
import projectRoutes from "./project.routes.js";
import certificationRoutes from "./certification.routes.js";
import badgeRoutes from "./badge.routes.js";
import feedRoutes from "./feed.routes.js";

// 1. Alumni routes import karein
import alumniRoutes from "../alumni/routes/alumni.routes.js";

const router = Router();

// 2. Alumni Directory (Students & Visitors ke liye open browseable)
router.use("/alumni", alumniRoutes);

// Centralized authentication (Baaki internal routes ke liye)
router.use(authenticateUser);

// Feature modules (Protected)
router.use("/users", userRoutes);
router.use("/staff", staffRoutes);
router.use("/students", studentRoutes);
router.use("/profiles", profileRoutes);
router.use("/academics", academicRoutes);
router.use("/projects", projectRoutes);
router.use("/certifications", certificationRoutes);
router.use("/badges", badgeRoutes);
router.use("/feed", feedRoutes);

export default router;