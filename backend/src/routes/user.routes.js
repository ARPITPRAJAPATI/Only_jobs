import { Router } from "express";
import {
    getMe,
    updatePassword,
} from "./../controllers/user.controller.js";

const router = Router();

router.get("/me", getMe);
router.patch("/change-password", updatePassword);

export default router;