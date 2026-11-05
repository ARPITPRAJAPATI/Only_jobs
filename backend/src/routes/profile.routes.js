import { Router } from "express";

import {
    createProfile,
    getStudentProfile,
    updateProfile,
    deleteProfile,
} from "../controllers/profile.controller.js";

const router = Router();

// Create profile
router.post("/create", createProfile);

// View any student's profile
router.get("/:studentId", getStudentProfile);

// Update own profile
router.patch("/:studentId", updateProfile);

// Delete own profile
router.delete("/:studentId", deleteProfile);

export default router;