import { Router } from "express";
import { registerStudent, getFullStudentProfile } from "../controllers/student.controller.js";

const router = Router();

// Student registration route
router.post("/register", registerStudent);

// Get complete aggregated profile (by studentId OR rollNumber)
router.get("/:identifier/full", getFullStudentProfile);

export default router;
