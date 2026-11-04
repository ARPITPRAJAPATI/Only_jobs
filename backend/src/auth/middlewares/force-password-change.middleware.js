export const requirePasswordChange = (req, res, next) => {
    if (req.user.mustChangePassword) {
        return res.status(403).json({
            success: false,
            message: "Please change your password before continuing.",
            code: "PASSWORD_CHANGE_REQUIRED",
        });
    }

    next();
};