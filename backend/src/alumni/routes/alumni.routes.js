import { Router } from "express";
import {
    getAlumniList,
    getAlumniStats,
    getAlumniById,
    createAlumniRecord,
} from "../controllers/alumni.controller.js";

const router = Router();

/**
 * Public/Student Endpoints
 */
// 1. Directory Listing (Multi-filter, Search, Pagination)
router.get("/", getAlumniList);

// 2. Directory Stats (Header metrics: Total verified, companies)
// DHYAN RAHE: /stats ko /:id se PEHLE likhna zaroori hai!
router.get("/stats", getAlumniStats);

// 3. Single Senior Profile Details by ID
router.get("/:id", getAlumniById);

/**
 * Admin / TPO Ingestion Endpoint
 */
// 4. Create new alumni record
router.post("/", createAlumniRecord);

export default router;