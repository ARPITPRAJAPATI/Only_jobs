import { Router } from "express";

import {
    addProject,
    getStudentProjects,
    updateProject,
    deleteProject,
} from "../controllers/project.controller.js";

import { authorizeRoles } from "../auth/middlewares/role.middleware.js";

const router = Router();

// Add project (Only Students can add projects)
router.post("/add", authorizeRoles("STUDENT"), addProject);

// View all projects of a student (All authenticated users)
router.get("/:studentId", getStudentProjects);

// Update project (Only owner student)
router.patch("/:studentId/:projectId", authorizeRoles("STUDENT"), updateProject);

// Delete project (Only owner student)
router.delete("/:studentId/:projectId", authorizeRoles("STUDENT"), deleteProject);

export default router;
