
import { Router } from "express";

import {
    addCertification,
    getStudentCertifications,
    updateCertification,
    deleteCertification,
} from "../controllers/certification.controller.js";

const router = Router();

router.post("/add", addCertification);

router.get("/:studentId", getStudentCertifications);

router.patch("/:studentId/:certificationId", updateCertification);

router.delete("/:studentId/:certificationId", deleteCertification);

export default router;
