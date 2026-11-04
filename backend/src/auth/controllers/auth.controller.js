import { loginUser, getCurrentUser } from "../services/auth.service.js";
import { registerStaff } from "../services/staff-registration.service.js";
import {
    getStaffProfile,
    upsertStaffProfile,
} from "../services/staff-profile.service.js";
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input

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

        // 2. Call authentication service
        const result = await loginUser({
            email,
            password,
        });

        // 3. Handle invalid credentials
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 4. Set JWT in HTTP-only cookie
        res.cookie("accessToken", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // 5. Send safe user information
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

export const getMe = async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or account is inactive",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user,
            },
        });

    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
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

        // 2. Validate email format
        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // 3. Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        // 4. Call registration service
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

        // 5. Send response
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

// Get logged-in staff profile
export const getMyStaffProfile = async (req, res) => {
    try {
        const profile = await getStaffProfile(req.user.id);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Staff profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: { profile },
        });

    } catch (error) {
        console.error("Get staff profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Create or update logged-in staff profile
export const saveMyStaffProfile = async (req, res) => {
    try {
        const {
            fullName,
            profileImage,
            designation,
            department,
            about,
            areasOfExpertise,
            subjects,
        } = req.body;

        // Validate required fields
        if (
            typeof fullName !== "string" || !fullName.trim() ||
            typeof designation !== "string" || !designation.trim() ||
            typeof department !== "string" || !department.trim() ||
            typeof about !== "string" || !about.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Full name, designation, department and about are required",
            });
        }

        // Validate optional fields
        if (
            (profileImage !== undefined &&
                profileImage !== null &&
                typeof profileImage !== "string") ||
            (areasOfExpertise !== undefined &&
                (!Array.isArray(areasOfExpertise) ||
                    !areasOfExpertise.every(item => typeof item === "string"))) ||
            (subjects !== undefined &&
                (!Array.isArray(subjects) ||
                    !subjects.every(item => typeof item === "string")))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile data",
            });
        }

        const profile = await upsertStaffProfile(req.user.id, {
            fullName: fullName.trim(),
            profileImage,
            designation: designation.trim(),
            department: department.trim(),
            about: about.trim(),
            areasOfExpertise: areasOfExpertise ?? [],
            subjects: subjects ?? [],
        });

        return res.status(200).json({
            success: true,
            message: "Staff profile saved successfully",
            data: { profile },
        });

    } catch (error) {
        console.error("Save staff profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};