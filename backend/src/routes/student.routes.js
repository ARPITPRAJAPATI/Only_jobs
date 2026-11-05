
import { Router } from "express";

import {
    registerStudent,
    getFullStudentProfile,
} from "../controllers/student.controller.js";

import { authorizeRoles } from "../auth/middlewares/role.middleware.js";

const router = Router();

// All routes require authentication


// Only Admin can register student records
router.post(
    "/register",
    authorizeRoles("ADMIN"),
    registerStudent
);

// All authenticated users can view complete student profiles
router.get(
    "/:identifier/full",
    getFullStudentProfile
);

export default router;
