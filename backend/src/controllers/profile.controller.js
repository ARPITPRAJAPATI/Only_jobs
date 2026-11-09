import prisma from "../config/prisma.js";

// 1. Create Student Profile (Student only)
export const createProfile = async (req, res) => {
    try {
        const {
            studentId,
            username,
            bio,
            avatarUrl,
            githubUrl,
            linkedinUrl,
            leetcodeUrl,
            codeforcesUrl,
            codechefUrl,
            xUrl,
        } = req.body;

        if (!username?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }

        // StudentId auto-resolve karo agar body mein na ho
        let targetStudentId = studentId;

        if (targetStudentId) {
            const student = await prisma.student.findUnique({
                where: { id: targetStudentId },
                select: { id: true, userId: true },
            });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student record not found",
                });
            }

            if (student.userId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only create your own profile",
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

        const profile = await prisma.studentProfile.create({
            data: {
                studentId: targetStudentId,
                username: username.trim(),
                bio: bio?.trim() || null,
                avatarUrl: avatarUrl?.trim() || null,
                githubUrl: githubUrl?.trim() || null,
                linkedinUrl: linkedinUrl?.trim() || null,
                leetcodeUrl: leetcodeUrl?.trim() || null,
                codeforcesUrl: codeforcesUrl?.trim() || null,
                codechefUrl: codechefUrl?.trim() || null,
                xUrl: xUrl?.trim() || null,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Student profile created successfully",
            data: profile,
        });

    } catch (error) {
        console.error("Profile creation error:", error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Username or student profile already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Profile creation failed",
        });
    }
};

// 2. View Student Profile (All authenticated roles)
export const getStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;

        const profile = await prisma.studentProfile.findUnique({
            where: {
                studentId,
            },
            include: {
                student: true,
            },
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student profile fetched successfully",
            data: profile,
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student profile",
        });
    }
};

// 3. Update Student Profile (Only owner student)
export const updateProfile = async (req, res) => {
    try {
        const { studentId } = req.params;

        const {
            username,
            bio,
            avatarUrl,
            githubUrl,
            linkedinUrl,
            leetcodeUrl,
            codeforcesUrl,
            codechefUrl,
            xUrl,
        } = req.body;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required",
            });
        }

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { userId: true },
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
                message: "You can only update your own profile",
            });
        }

        const profile = await prisma.studentProfile.update({
            where: {
                studentId,
            },
            data: {
                ...(username !== undefined && { username: username.trim() }),
                ...(bio !== undefined && { bio: bio?.trim() || null }),
                ...(avatarUrl !== undefined && { avatarUrl: avatarUrl?.trim() || null }),
                ...(githubUrl !== undefined && { githubUrl: githubUrl?.trim() || null }),
                ...(linkedinUrl !== undefined && { linkedinUrl: linkedinUrl?.trim() || null }),
                ...(leetcodeUrl !== undefined && { leetcodeUrl: leetcodeUrl?.trim() || null }),
                ...(codeforcesUrl !== undefined && { codeforcesUrl: codeforcesUrl?.trim() || null }),
                ...(codechefUrl !== undefined && { codechefUrl: codechefUrl?.trim() || null }),
                ...(xUrl !== undefined && { xUrl: xUrl?.trim() || null }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile,
        });

    } catch (error) {
        console.error("Profile update error:", error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Username already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Profile update failed",
        });
    }
};

// 4. Delete Student Profile (Only owner student)
export const deleteProfile = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required",
            });
        }

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { userId: true },
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
                message: "You can only delete your own profile",
            });
        }

        await prisma.studentProfile.delete({
            where: {
                studentId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Student profile deleted successfully",
        });

    } catch (error) {
        console.error("Delete profile error:", error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Profile deletion failed",
        });
    }
};