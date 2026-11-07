import { Router } from "express";
import {
    register,
    login,
    logout,
} from "../controllers/auth.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);

export default router;