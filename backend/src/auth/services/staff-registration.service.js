import prisma from "../../config/prisma.js";
import { hashPassword } from "../utils/password.util.js";
import { getStaffFromRegistry } from "./registry/staff-registry.service.js";

export const registerStaff = async ({ email, password }) => {

    // 1. Find staff using official email
    const staff = await getStaffFromRegistry(email);

    if (!staff) {
        return {
            error: "STAFF_NOT_FOUND",
        };
    }

    // 2. Check if staff has already registered
    if (staff.userId) {
        return {
            error: "ALREADY_REGISTERED",
        };
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Create user and link staff registry
    const user = await prisma.$transaction(async (tx) => {

        const newUser = await tx.user.create({
            data: {
                email: staff.email,
                passwordHash,
                role: staff.role,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        await tx.staffRegistry.update({
            where: {
                id: staff.id,
            },
            data: {
                userId: newUser.id,
            },
        });

        return newUser;
    });

    return {
        user,
        staffId: staff.staffId,
    };
};