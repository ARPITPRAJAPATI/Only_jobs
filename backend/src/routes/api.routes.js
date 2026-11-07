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

const router = Router();

// Centralized authentication
router.use(authenticateUser);

// Feature modules
router.use("/users", userRoutes);
router.use("/staff", staffRoutes);
router.use("/students", studentRoutes);
router.use("/profiles", profileRoutes);
router.use("/academics", academicRoutes);
router.use("/projects", projectRoutes);
router.use("/certifications", certificationRoutes);
router.use("/badges", badgeRoutes);

export default router;