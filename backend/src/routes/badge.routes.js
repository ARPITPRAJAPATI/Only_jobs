import { Router } from "express";

import {
    createCatalogBadge,
    getCatalogBadges,
    applyForBadge,
    getStudentBadges,
    reviewBadgeRequest,
} from "../controllers/badge.controller.js";

import { authorizeRoles } from "../auth/middlewares/role.middleware.js";

const router = Router();

// 1. Admin creates a master badge in catalog
router.post("/catalog", authorizeRoles("ADMIN"), createCatalogBadge);

// 2. All authenticated users can view available badges in catalog
router.get("/catalog", getCatalogBadges);

// 3. Student applies for a badge with proof
router.post("/apply", authorizeRoles("STUDENT"), applyForBadge);

// 4. View a student's badges (Public sees approved only; Student & Admin see all)
router.get("/:studentId", getStudentBadges);

// 5. Admin reviews & approves/rejects badge request
router.patch("/requests/:studentBadgeId/review", authorizeRoles("ADMIN"), reviewBadgeRequest);

export default router;
