import prisma from "../../../config/prisma.js";
import { generateStaffId } from "../../utils/staff-id.util.js";

export const addStaffToRegistry = async ({ email, role, name }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const allowedRoles = ["DEAN", "TEACHER", "TPO"];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid staff role");
    }

    try {
        const staff = await prisma.staffRegistry.create({
            data: {
                email: normalizedEmail,
                role,
                name: name?.trim() || null,
                staffId: generateStaffId(),
            },
            select: {
                id: true,
                staffId: true,
                email: true,
                name: true,
                role: true,
            },
        });

        return staff;

    } catch (error) {
        if (error.code === "P2002") {
            throw new Error("Staff email or Staff ID already exists");
        }

        throw error;
    }
};

export const getStaffFromRegistry = async (email) => {
    const staff = await prisma.staffRegistry.findFirst({
        where: {
            email: email.trim().toLowerCase(),
            isActive: true,
        },
        select: {
            id: true,
            staffId: true,
            email: true,
            name: true,
            role: true,
            userId: true,
        },
    });

    return staff || null;
};

export const getAllStaffFromRegistry = async () => {
    return await prisma.staffRegistry.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};