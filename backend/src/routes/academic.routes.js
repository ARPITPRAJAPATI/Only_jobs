import { Router } from "express";

import {
    addAcademicRecord,
    getAcademicRecords,
    updateAcademicRecord,
    deleteAcademicRecord,
} from "../controllers/academic.controller.js";

import { authorizeRoles } from "../auth/middlewares/role.middleware.js";

const router = Router();

// Admin-only: Add academic record
router.post(
    "/add",
    authorizeRoles("ADMIN"),
    addAcademicRecord
);

// All authenticated roles can view
router.get("/:studentId", getAcademicRecords);

// Admin-only: Update academic record
router.patch(
    "/:studentId/:semester",
    authorizeRoles("ADMIN"),
    updateAcademicRecord
);

// Admin-only: Delete academic record
router.delete(
    "/:studentId/:semester",
    authorizeRoles("ADMIN"),
    deleteAcademicRecord
);

export default router;