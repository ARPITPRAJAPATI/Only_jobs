import prisma from "../../../config/prisma.js";

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
            role: true,
            userId: true,
        },
    });

    return staff || null;
};