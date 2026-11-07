import { getCurrentUser, changePassword } from "../auth/services/auth.service.js";

// GET /api/users/me
export const getMe = async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

// PATCH /api/users/change-password
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters",
            });
        }

        const user = await changePassword({
            userId: req.user.id,
            currentPassword,
            newPassword,
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: user,
        });
    } catch (error) {
        if (error.message === "INVALID_CURRENT_PASSWORD") {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to change password",
        });
    }
};