import {
    getStaffProfile,
    upsertStaffProfile,
} from "../auth/services/staff-profile.service.js";

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