
import prisma from "../../config/prisma.js";
import { hashPassword } from "../utils/password.util.js";

export const provisionStudentAccount = async ({ studentId }) => {
    const student = await prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });

    if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
    }

    if (student.userId) {
        throw new Error("ACCOUNT_ALREADY_EXISTS");
    }

    if (!student.email) {
        throw new Error("STUDENT_EMAIL_NOT_FOUND");
    }

    const email = student.email.trim().toLowerCase();

    // Check whether email already belongs to another User
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_REGISTERED");
    }

    // Initial password = student's email
    const passwordHash = await hashPassword(email);

    let user;

    try {
        // Create User and link Student in one transaction
        user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role: "STUDENT",
                    mustChangePassword: true,
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    mustChangePassword: true,
                },
            });

            await tx.student.update({
                where: {
                    id: student.id,
                },
                data: {
                    userId: newUser.id,
                },
            });

            return newUser;
        });

    } catch (error) {
        if (error.code === "P2002") {
            throw new Error("ACCOUNT_ALREADY_EXISTS");
        }

        throw error;
    }

    return user;
};
