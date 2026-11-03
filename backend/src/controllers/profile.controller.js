import prisma from "../config/prisma.js";

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

        // Basic validation
        if (!studentId || !username) {
            return res.status(400).json({
                success: false,
                message: "Student ID and username are required",
            });
        }

        // Create profile
        const profile = await prisma.studentProfile.create({
            data: {
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

        if (error.code === "P2003") {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Profile creation failed",
        });
    }
};

export const getStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;

        const profile = await prisma.studentProfile.findUnique({
            where: {
                studentId: studentId,
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

        const profile = await prisma.studentProfile.update({
            where: {
                studentId,
            },
            data: {
                username,
                bio,
                avatarUrl,
                githubUrl,
                linkedinUrl,
                leetcodeUrl,
                codeforcesUrl,
                codechefUrl,
                xUrl,
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

export const deleteProfile = async (req, res) => {
    try {
        const { studentId } = req.params;

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