import prisma from "../../config/prisma.js";
import { comparePassword } from "../utils/password.util.js";
import { generateToken } from "../utils/token.util.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";

export const loginUser = async ({ email, password }) => {

    // 1. Find user by email
    const user = await prisma.user.findUnique({
        where: {
            email: email.trim().toLowerCase(),
        },
    });

    // 2. Check whether user exists
    if (!user) {
        return null;
    }

    // 3. Check whether account is active
    if (!user.isActive) {
        return null;
    }

    // 4. Verify password
    const isPasswordValid = await comparePassword(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        return null;
    }

    // 5. Generate JWT
    const token = generateToken(user);

    // 6. Return safe user data
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
        },
    };
};

export const getCurrentUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            mustChangePassword: true,
        },
    });

    if (!user || !user.isActive) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
    };
};

export const changePassword = async ({
    userId,
    currentPassword,
    newPassword,
}) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || !user.isActive) {
        throw new Error("USER_NOT_FOUND");
    }

    const isPasswordValid = await comparePassword(
        currentPassword,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw new Error("INVALID_CURRENT_PASSWORD");
    }

    const newPasswordHash = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            passwordHash: newPasswordHash,
            mustChangePassword: false,
        },
        select: {
            id: true,
            email: true,
            role: true,
            mustChangePassword: true,
        },
    });

    return updatedUser;
};