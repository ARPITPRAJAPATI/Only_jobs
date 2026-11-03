
import { Router } from "express";

import {
    getStudentBadges,
} from "../controllers/badge.controller.js";

const router = Router();

router.get("/:studentId", getStudentBadges);

export default router;
