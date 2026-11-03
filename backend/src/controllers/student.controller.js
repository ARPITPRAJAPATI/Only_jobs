import prisma from "../config/prisma.js";

export const registerStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            collegeName,
            rollNumber,
            libraryId,
            course,
            branch,
            batch,
        } = req.body;

        // Basic validation
        if (!name || !email || !rollNumber || !collegeName || !course || !branch || !batch) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Create student
        const student = await prisma.student.create({
            data: {
                name,
                email,
                collegeName,
                rollNumber,
                libraryId,
                course,
                branch,
                batch: Number(batch),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: student,
        });

    } catch (error) {
        console.error("Student registration error:", error);

        if (error.code === "P2002") {
            const field = error.meta?.target?.[0] || "Field";

            return res.status(409).json({
                success: false,
                message: `${field} already exists`,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Student registration failed",
        });
    }
};

// Aggregated Full Student Profile (All 5 modules in 1 call)
export const getFullStudentProfile = async (req, res) => {
    try {
        const { identifier } = req.params; // Can be studentId OR rollNumber

        const student = await prisma.student.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { rollNumber: identifier },
                ],
            },
            include: {
                studentProfile: true,
                academicRecords: {
                    orderBy: {
                        semester: "asc",
                    },
                },
                projects: {
                    orderBy: [
                        { isPinned: "desc" },
                        { createdAt: "desc" },
                    ],
                },
                certifications: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                studentBadges: {
                    orderBy: {
                        awardedAt: "desc",
                    },
                },
            },
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Full student profile fetched successfully",
            data: student,
        });

    } catch (error) {
        console.error("Get full student profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch full student profile",
        });
    }
};