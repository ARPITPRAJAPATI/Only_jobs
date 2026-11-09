import {
    getStaffProfile,
    upsertStaffProfile,
} from "../auth/services/staff-profile.service.js";

import {
    addStaffToRegistry,
    getAllStaffFromRegistry,
} from "../auth/services/registry/staff-registry.service.js";

// GET /api/staff/profile
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
            data: profile,
        });
    } catch (error) {
        console.error("Get staff profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch staff profile",
        });
    }
};

// PUT /api/staff/profile
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
            data: profile,
        });
    } catch (error) {
        console.error("Save staff profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save staff profile",
        });
    }
};

// POST /api/staff/registry (Admin pre-approves a staff member)
export const addStaffMember = async (req, res) => {
    try {
        const { email, role, name } = req.body;

        if (!email?.trim() || !role?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Staff email and role (DEAN, TEACHER, TPO) are required",
            });
        }

        const staff = await addStaffToRegistry({
            email,
            role,
            name,
        });

        return res.status(201).json({
            success: true,
            message: "Staff member added to registry successfully",
            data: staff,
        });
    } catch (error) {
        if (error.message === "Invalid staff role") {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Allowed roles: DEAN, TEACHER, TPO",
            });
        }

        if (error.message === "Staff email or Staff ID already exists") {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Add staff to registry error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add staff to registry",
        });
    }
};

// GET /api/staff/registry (Admin views all pre-approved staff)
export const getStaffRegistry = async (req, res) => {
    try {
        const staffList = await getAllStaffFromRegistry();

        return res.status(200).json({
            success: true,
            data: staffList,
        });
    } catch (error) {
        console.error("Get staff registry error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch staff registry",
        });
    }
};