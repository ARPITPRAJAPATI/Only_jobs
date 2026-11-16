import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../../auth/middlewares/auth.middleware.js";
import {
    getJobDrives,
    getOffCampusJobs,
    getRecommendedJobs,
    getStudentApplications,
    applyToJobDrive,
    withdrawJobApplication,
    acceptJobOffer,
    createJobDrive,
    // Agent Controllers
    ingestRawJobPosting,
    getPendingRawJobs,
    publishCuratedJob,
    updateRawJobStatus,
} from "../controllers/job.controller.js";

const router = Router();

// ==========================================
// Public / Student Read Endpoints
// ==========================================
// 1. On-Campus Placement Drives (Optional Auth: Computes real-time eligibility if logged in)
router.get("/drives", optionalAuthenticateUser, getJobDrives);

// 2. Curated Off-Campus Jobs
router.get("/offcampus", getOffCampusJobs);

// 3. Smart Recommendations
router.get("/recommended", authenticateUser, getRecommendedJobs);

// 4. Student Applications Tracker
router.get("/applications", authenticateUser, getStudentApplications);

// ==========================================
// Student Actions
// ==========================================
// 5. 1-Click Apply to Drive
router.post("/drives/:driveId/apply", authenticateUser, applyToJobDrive);

// 6. Withdraw Application
router.delete("/applications/:id", authenticateUser, withdrawJobApplication);

// 7. Accept Offer
router.patch("/applications/:id/accept", authenticateUser, acceptJobOffer);

// ==========================================
// TPO Admin Endpoints
// ==========================================
// 8. Publish New On-Campus Drive
router.post("/drives", authenticateUser, createJobDrive);

// ==========================================
// AI Agent / Scraper Endpoints
// ==========================================
// 9. Raw Scraper Ingestion
router.post("/agent/ingest-raw", ingestRawJobPosting);

// 10. Fetch Pending Raw Queue
router.get("/agent/raw-pending", getPendingRawJobs);

// 11. Publish Normalized / Curated Job
router.post("/agent/publish", publishCuratedJob);

// 12. Update Raw Job Status (Reject / Fail / Retry)
router.patch("/agent/raw/:id/status", updateRawJobStatus);

export default router;