
import prisma from "../config/prisma.js";

// Get Student Badges
export const getStudentBadges = async (req, res) => {
    try {
        const { studentId } = req.params;

        const badges = await prisma.studentBadge.findMany({
            where: {
                studentId,
            },
            orderBy: {
                awardedAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Student badges fetched successfully",
            data: badges,
        });

    } catch (error) {
        console.error("Get student badges error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student badges",
        });
    }
};
