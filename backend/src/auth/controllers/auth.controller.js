import { loginUser } from "../services/auth.service.js";
import { registerStaff } from "../services/staff-registration.service.js";

// 1. Staff Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        const result = await loginUser({
            email: normalizedEmail,
            password,
        });

        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        res.cookie("accessToken", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: result.user,
            },
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// 2. Staff Registration (self-registration validated against StaffRegistry)
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        const result = await registerStaff({
            email: normalizedEmail,
            password,
        });

        if (result.error === "STAFF_NOT_FOUND") {
            return res.status(403).json({
                success: false,
                message: "Staff record not found. Contact administration.",
            });
        }

        if (result.error === "ALREADY_REGISTERED") {
            return res.status(409).json({
                success: false,
                message: "Staff account already registered",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Staff registration successful",
            data: {
                user: result.user,
            },
        });

    } catch (error) {
        console.error("Staff registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// 3. Logout
export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};
