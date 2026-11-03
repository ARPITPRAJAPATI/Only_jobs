import { Router } from "express";
import { createProfile, getStudentProfile, updateProfile, deleteProfile } from "../controllers/profile.controller.js";

const router = Router();

router.post("/create", createProfile);
router.get("/:studentId", getStudentProfile);
router.patch("/:studentId", updateProfile);
router.delete("/:studentId", deleteProfile);
export default router;