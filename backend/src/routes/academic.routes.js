import { Router } from "express";
import { addAcademicRecord, getAcademicRecords, updateAcademicRecord, deleteAcademicRecord } from "../controllers/academic.controller.js";

const router = Router();

router.post("/add", addAcademicRecord);
router.get("/:studentId", getAcademicRecords);
router.patch("/:studentId/:semester", updateAcademicRecord);
router.delete("/:studentId/:semester", deleteAcademicRecord);
export default router;