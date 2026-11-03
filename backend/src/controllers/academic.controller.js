import prisma from "../config/prisma.js";

export const addAcademicRecord = async (req, res) => {
    try {
        const {
            studentId,
            semester,
            sgpa,
            cgpa,
            backlogs,
        } = req.body;

        // Basic validation
        if (
            !studentId ||
            !Number.isInteger(semester) ||
            semester < 1 ||
            semester > 8 ||
            typeof sgpa !== "number" ||
            typeof cgpa !== "number" ||
            !Number.isInteger(backlogs) ||
            backlogs < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid academic details",
            });
        }

        // Create academic record
        const record = await prisma.academicRecord.create({
            data: {
                studentId,
                semester,
                sgpa,
                cgpa,
                backlogs,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Academic record added successfully",
            data: record,
        });

    } catch (error) {
        console.error("Academic record error:", error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Academic record for this semester already exists",
            });
        }

        if (error.code === "P2003") {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add academic record",
        });
    }
};

export const getAcademicRecords = async (req, res) => {
    try {
        const { studentId } = req.params;

        const records = await prisma.academicRecord.findMany({
            where: {
                studentId,
            },
            orderBy: {
                semester: "asc",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Academic records fetched successfully",
            data: records,
        });

    } catch (error) {
        console.error("Get academic records error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch academic records",
        });
    }
};

export const updateAcademicRecord = async (req, res) => {
    try {
        const { studentId, semester } = req.params;

        const semesterNumber = Number(semester);

        const {
            sgpa,
            cgpa,
            backlogs,
        } = req.body;

        // Basic validation
        if (
            !Number.isInteger(semesterNumber) ||
            semesterNumber < 1 ||
            semesterNumber > 8 ||
            (sgpa !== undefined && (typeof sgpa !== "number" || sgpa < 0 || sgpa > 10)) ||
            (cgpa !== undefined && (typeof cgpa !== "number" || cgpa < 0 || cgpa > 10)) ||
            (backlogs !== undefined && (!Number.isInteger(backlogs) || backlogs < 0))
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid academic details",
            });
        }

        const record = await prisma.academicRecord.update({
            where: {
                studentId_semester: {
                    studentId,
                    semester: semesterNumber,
                },
            },
            data: {
                ...(sgpa !== undefined && { sgpa }),
                ...(cgpa !== undefined && { cgpa }),
                ...(backlogs !== undefined && { backlogs }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Academic record updated successfully",
            data: record,
        });

    } catch (error) {
        console.error("Academic update error:", error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Academic record not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Academic record update failed",
        });
    }
};
export const deleteAcademicRecord = async (req, res) => {
    try {
        const { studentId, semester } = req.params;

        const semesterNumber = Number(semester);

        if (
            !Number.isInteger(semesterNumber) ||
            semesterNumber < 1 ||
            semesterNumber > 8
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid semester number",
            });
        }

        await prisma.academicRecord.delete({
            where: {
                studentId_semester: {
                    studentId,
                    semester: semesterNumber,
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: "Academic record deleted successfully",
        });

    } catch (error) {
        console.error("Delete academic record error:", error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Academic record not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Academic record deletion failed",
        });
    }
};