import { Router } from "express";
import { registerStudent } from "../controllers/student.controller.js";

const router = Router();

// Student registration route
router.post("/register", registerStudent);

export default router;