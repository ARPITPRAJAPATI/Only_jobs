import { Router } from "express";
import {
    register,
    login,
    logout,
    getMe,
    getMyStaffProfile,
    saveMyStaffProfile,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router = Router();
// register
router.post("/register", register);
// Login route
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
// Get currently logged-in user
router.get("/me", authenticateUser, getMe);


// Staff profile routes
router.get(
    "/staff/profile",
    authenticateUser,
    authorizeRoles("DEAN", "TEACHER", "TPO"),
    getMyStaffProfile
);

router.put(
    "/staff/profile",
    authenticateUser,
    authorizeRoles("DEAN", "TEACHER", "TPO"),
    saveMyStaffProfile
);
export default router;