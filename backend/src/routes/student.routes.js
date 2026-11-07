import { Router } from "express";

import {
    registerStudent,
    getFullStudentProfile,
} from "../controllers/student.controller.js";

import { authorizeRoles } from "../auth/middlewares/role.middleware.js";

const router = Router();

// Admin only: Register student record + create login account in one step
router.post(
    "/register",
    authorizeRoles("ADMIN"),
    registerStudent
);

// All authenticated users can view full student profile
router.get(
    "/:identifier/full",
    getFullStudentProfile
);

export default router;
