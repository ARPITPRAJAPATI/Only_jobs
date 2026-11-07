import { Router } from "express";

import {
    addCertification,
    getStudentCertifications,
    updateCertification,
    deleteCertification,
    verifyCertification,
} from "../controllers/certification.controller.js";

import { authorizeRoles } from "../auth/middlewares/role.middleware.js";

const router = Router();

// Student: Submit certificate for verification
router.post("/add", authorizeRoles("STUDENT"), addCertification);

// View certificates (Public sees verified only; Student owner & Admin see all)
router.get("/:studentId", getStudentCertifications);

// Student: Update own certificate
router.patch("/:studentId/:certificationId", authorizeRoles("STUDENT"), updateCertification);

// Student: Delete own certificate
router.delete("/:studentId/:certificationId", authorizeRoles("STUDENT"), deleteCertification);

// Admin only: Verify/Approve certificate
router.patch("/:studentId/:certificationId/verify", authorizeRoles("ADMIN"), verifyCertification);

export default router;