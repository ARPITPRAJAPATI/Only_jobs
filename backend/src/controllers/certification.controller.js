
import prisma from "../config/prisma.js";

// 1. Add Certification
export const addCertification = async (req, res) => {
    try {
        const {
            studentId,
            title,
            issuer,
            credentialId,
            credentialUrl,
            certificateUrl,
            issuedAt,
            expiresAt,
        } = req.body;

        if (!studentId || !title?.trim() || !issuer?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Student ID, title and issuer are required",
            });
        }

        const certification = await prisma.certification.create({
            data: {
                studentId,
                title: title.trim(),
                issuer: issuer.trim(),
                credentialId,
                credentialUrl,
                certificateUrl,
                issuedAt: issuedAt ? new Date(issuedAt) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Certification added successfully",
            data: certification,
        });

    } catch (error) {
        console.error("Add certification error:", error);

        if (error.code === "P2003") {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add certification",
        });
    }
};


// 2. Get Student Certifications
export const getStudentCertifications = async (req, res) => {
    try {
        const { studentId } = req.params;

        const certifications = await prisma.certification.findMany({
            where: {
                studentId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Certifications fetched successfully",
            data: certifications,
        });

    } catch (error) {
        console.error("Get certifications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch certifications",
        });
    }
};


// 3. Update Certification
export const updateCertification = async (req, res) => {
    try {
        const { studentId, certificationId } = req.params;

        const {
            title,
            issuer,
            credentialId,
            credentialUrl,
            certificateUrl,
            issuedAt,
            expiresAt,
        } = req.body;

        if (
            (title !== undefined &&
                (typeof title !== "string" || !title.trim())) ||
            (issuer !== undefined &&
                (typeof issuer !== "string" || !issuer.trim())) ||
            (issuedAt !== undefined &&
                issuedAt !== null &&
                Number.isNaN(Date.parse(issuedAt))) ||
            (expiresAt !== undefined &&
                expiresAt !== null &&
                Number.isNaN(Date.parse(expiresAt)))
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid certification details",
            });
        }

        const existingCertification =
            await prisma.certification.findFirst({
                where: {
                    id: certificationId,
                    studentId,
                },
            });

        if (!existingCertification) {
            return res.status(404).json({
                success: false,
                message: "Certification not found",
            });
        }

        const certification = await prisma.certification.update({
            where: {
                id: certificationId,
            },
            data: {
                ...(title !== undefined && { title: title.trim() }),
                ...(issuer !== undefined && { issuer: issuer.trim() }),
                ...(credentialId !== undefined && { credentialId }),
                ...(credentialUrl !== undefined && { credentialUrl }),
                ...(certificateUrl !== undefined && { certificateUrl }),
                ...(issuedAt !== undefined && {
                    issuedAt: issuedAt ? new Date(issuedAt) : null,
                }),
                ...(expiresAt !== undefined && {
                    expiresAt: expiresAt ? new Date(expiresAt) : null,
                }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Certification updated successfully",
            data: certification,
        });

    } catch (error) {
        console.error("Update certification error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update certification",
        });
    }
};


// 4. Delete Certification
export const deleteCertification = async (req, res) => {
    try {
        const { studentId, certificationId } = req.params;

        const existingCertification =
            await prisma.certification.findFirst({
                where: {
                    id: certificationId,
                    studentId,
                },
            });

        if (!existingCertification) {
            return res.status(404).json({
                success: false,
                message: "Certification not found",
            });
        }

        await prisma.certification.delete({
            where: {
                id: certificationId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Certification deleted successfully",
        });

    } catch (error) {
        console.error("Delete certification error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete certification",
        });
    }
};
