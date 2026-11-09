import { Router } from "express";

import {
    getMyStaffProfile,
    saveMyStaffProfile,
    addStaffMember,
    getStaffRegistry,
} from "../controllers/staff.controller.js";

import { authorizeRoles } from "../auth/middlewares/role.middleware.js";

const router = Router();

// Staff personal profile management
router.get(
    "/profile",
    authorizeRoles("DEAN", "TEACHER", "TPO"),
    getMyStaffProfile
);

router.put(
    "/profile",
    authorizeRoles("DEAN", "TEACHER", "TPO"),
    saveMyStaffProfile
);

// Admin only: Staff Registry Management (Pre-approving staff for self-registration)
router.post(
    "/registry",
    authorizeRoles("ADMIN"),
    addStaffMember
);

router.get(
    "/registry",
    authorizeRoles("ADMIN"),
    getStaffRegistry
);

export default router;