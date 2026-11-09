import prisma from "../config/prisma.js";

// 1. Admin adds a new badge to the Master Catalog
export const createCatalogBadge = async (req, res) => {
    try {
        const { title, description, imageUrl, category } = req.body;

        if (!title?.trim() || !description?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Badge title and description are required",
            });
        }

        const badge = await prisma.badgeCatalog.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                imageUrl: imageUrl?.trim() || null,
                category: category?.trim() || null,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Badge added to catalog successfully",
            data: badge,
        });

    } catch (error) {
        console.error("Create catalog badge error:", error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "A badge with this title already exists in the catalog",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create catalog badge",
        });
    }
};

// 2. All Authenticated Users: View all available badges in Master Catalog
export const getCatalogBadges = async (req, res) => {
    try {
        const catalog = await prisma.badgeCatalog.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Badge catalog fetched successfully",
            data: catalog,
        });

    } catch (error) {
        console.error("Get catalog badges error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch badge catalog",
        });
    }
};

// 3. Student applies for a badge with proof
export const applyForBadge = async (req, res) => {
    try {
        const { badgeId, proofUrl, screenshotUrl, studentId } = req.body;

        if (!badgeId || !proofUrl?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Badge ID and proof URL are required to apply",
            });
        }

        // Verify badge exists in catalog
        const catalogBadge = await prisma.badgeCatalog.findUnique({
            where: { id: badgeId },
        });

        if (!catalogBadge) {
            return res.status(404).json({
                success: false,
                message: "Badge not found in catalog",
            });
        }

        // Resolve student & verify ownership
        let targetStudentId = studentId;

        if (targetStudentId) {
            const student = await prisma.student.findUnique({
                where: { id: targetStudentId },
                select: { id: true, userId: true },
            });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                });
            }

            if (student.userId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only apply for badges for your own profile",
                });
            }
        } else {
            const student = await prisma.student.findUnique({
                where: { userId: req.user.id },
                select: { id: true },
            });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student record not found for your account",
                });
            }

            targetStudentId = student.id;
        }

        // Check if student already has a pending or approved request for this badge
        const existingApplication = await prisma.studentBadge.findFirst({
            where: {
                studentId: targetStudentId,
                badgeId,
                status: {
                    in: ["PENDING", "APPROVED"],
                },
            },
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: existingApplication.status === "APPROVED"
                    ? "You already have this badge"
                    : "You already have a pending application for this badge",
            });
        }

        // Create badge request with PENDING status
        const studentBadge = await prisma.studentBadge.create({
            data: {
                studentId: targetStudentId,
                badgeId: catalogBadge.id,
                title: catalogBadge.title,
                description: catalogBadge.description,
                imageUrl: catalogBadge.imageUrl,
                proofUrl: proofUrl.trim(),
                screenshotUrl: screenshotUrl?.trim() || null,
                status: "PENDING",
            },
        });

        return res.status(201).json({
            success: true,
            message: "Badge application submitted successfully. Pending admin review.",
            data: studentBadge,
        });

    } catch (error) {
        console.error("Apply for badge error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to apply for badge",
        });
    }
};

// 4. View Student Badges
// Public sees only APPROVED badges.
// The student owner and Admins can see all (including PENDING).
export const getStudentBadges = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { id: true, userId: true },
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const isOwner = student.userId === req.user.id;
        const isAdmin = req.user.role === "ADMIN";

        // If not owner and not admin, only fetch approved badges
        const whereClause = {
            studentId,
            ...(isOwner || isAdmin ? {} : { status: "APPROVED" }),
        };

        const badges = await prisma.studentBadge.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc",
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

// 5. Admin Review / Verification: Approve or Reject a badge application
export const reviewBadgeRequest = async (req, res) => {
    try {
        const { studentBadgeId } = req.params;
        const { status } = req.body; // "APPROVED" or "REJECTED"

        if (!status || !["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'APPROVED' or 'REJECTED'",
            });
        }

        const existingBadge = await prisma.studentBadge.findUnique({
            where: { id: studentBadgeId },
        });

        if (!existingBadge) {
            return res.status(404).json({
                success: false,
                message: "Badge application not found",
            });
        }

        const isApproved = status === "APPROVED";

        const updatedBadge = await prisma.studentBadge.update({
            where: { id: studentBadgeId },
            data: {
                status,
                reviewedBy: req.user.id,
                reviewedAt: new Date(),
                awardedBy: isApproved ? "ADMIN" : null,
                awardedAt: isApproved ? new Date() : null,
            },
        });

        return res.status(200).json({
            success: true,
            message: isApproved
                ? "Badge approved successfully and is now active on student profile"
                : "Badge application rejected",
            data: updatedBadge,
        });

    } catch (error) {
        console.error("Review badge request error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to review badge request",
        });
    }
};
// 6. Student pins/unpins an earned badge (Max 2 badges can be pinned to profile and posts)
export const togglePinBadge = async (req, res) => {
    try {
        const { studentBadgeId } = req.params;

        const badge = await prisma.studentBadge.findUnique({
            where: { id: studentBadgeId },
            include: {
                student: {
                    select: { userId: true },
                },
            },
        });

        if (!badge) {
            return res.status(404).json({
                success: false,
                message: "Badge not found",
            });
        }

        // Ownership check
        if (badge.student.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only pin your own badges",
            });
        }

        // Must be an approved badge
        if (badge.status !== "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Only approved badges can be pinned to your profile and posts",
            });
        }

        const willPin = !badge.isPinned;

        // If trying to pin, check if already 2 pinned
        if (willPin) {
            const pinnedCount = await prisma.studentBadge.count({
                where: {
                    studentId: badge.studentId,
                    isPinned: true,
                },
            });

            if (pinnedCount >= 2) {
                return res.status(400).json({
                    success: false,
                    message: "You can pin a maximum of 2 badges to your profile and posts",
                });
            }
        }

        const updatedBadge = await prisma.studentBadge.update({
            where: { id: studentBadgeId },
            data: {
                isPinned: willPin,
            },
        });

        return res.status(200).json({
            success: true,
            message: willPin ? "Badge pinned successfully" : "Badge unpinned successfully",
            data: updatedBadge,
        });

    } catch (error) {
        console.error("Toggle pin badge error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle badge pin status",
        });
    }
};