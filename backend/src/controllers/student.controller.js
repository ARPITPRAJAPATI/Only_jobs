import prisma from "../config/prisma.js";
import { hashPassword } from "../auth/utils/password.util.js";

// 1. Admin only: Register student record + create login account in one step
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
            tempPassword,
        } = req.body;

        if (
            !name ||
            !email ||
            !rollNumber ||
            !collegeName ||
            !course ||
            !branch ||
            !batch ||
            !tempPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields including tempPassword",
            });
        }

        if (typeof tempPassword !== "string" || tempPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Temporary password must be at least 6 characters",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const passwordHash = await hashPassword(tempPassword);

        const result = await prisma.$transaction(async (tx) => {
            // Create login User account
            const newUser = await tx.user.create({
                data: {
                    email: normalizedEmail,
                    passwordHash,
                    role: "STUDENT",
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            });

            // Create official Student record linked to User
            const newStudent = await tx.student.create({
                data: {
                    name: name.trim(),
                    email: normalizedEmail,
                    collegeName: collegeName.trim(),
                    rollNumber: rollNumber.trim(),
                    libraryId: libraryId?.trim() || null,
                    course: course.trim(),
                    branch: branch.trim(),
                    batch: Number(batch),
                    userId: newUser.id,
                },
            });

            return {
                student: newStudent,
                user: newUser,
            };
        });

        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: result,
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

// 2. All authenticated users: Aggregated Full Student Profile
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
                badges: {
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
