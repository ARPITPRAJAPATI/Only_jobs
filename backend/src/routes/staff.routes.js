import { Router } from "express";

import {
    getMyStaffProfile,
    saveMyStaffProfile,
} from "../controllers/staff.controller.js";

import { authorizeRoles } from "../auth/middlewares/role.middleware.js";

const router = Router();

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

export default router;