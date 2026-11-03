import { Router } from "express";

import {
    addProject,
    getStudentProjects,
    updateProject,
    deleteProject
} from "../controllers/project.controller.js";

const router = Router();

// Add project
router.post("/add", addProject);

// Get all student projects
router.get("/:studentId", getStudentProjects);

// Update project
router.patch("/:studentId/:projectId", updateProject);

// Delete project
router.delete("/:studentId/:projectId", deleteProject);

export default router;