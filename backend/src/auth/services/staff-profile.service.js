import prisma from "../../config/prisma.js";

// Get staff profile
export const getStaffProfile = async (userId) => {
    return await prisma.staffProfile.findUnique({
        where: {
            userId,
        },
    });
};

// Create or update staff profile
export const upsertStaffProfile = async (userId, data) => {
    return await prisma.staffProfile.upsert({
        where: {
            userId,
        },

        create: {
            userId,
            ...data,
        },

        update: {
            ...data,
        },
    });
};