import { verifyToken } from "../utils/token.util.js";
import prisma from "../../config/prisma.js";

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login.",
            });
        }

        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
            select: {
                id: true,
                role: true,
                isActive: true,
                mustChangePassword: true,
            },
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "User not found or account inactive.",
            });
        }

        req.user = {
            id: user.id,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again.",
        });
    }
};