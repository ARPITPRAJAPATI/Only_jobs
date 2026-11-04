import { Router } from "express";
import {
    register,
    login,
    logout,
    getMe,
    getMyStaffProfile,
    saveMyStaffProfile,
    updatePassword,
    registerStudentAccount,

} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

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
router.patch(
    "/change-password",
    authenticateUser,
    updatePassword
);
router.post(
    "/students/register",
    authenticateUser,
    authorizeRoles("ADMIN"),
    registerStudentAccount
);
export default router;