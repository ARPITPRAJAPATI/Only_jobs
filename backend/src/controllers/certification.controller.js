import prisma from "../config/prisma.js";

// 1. Student submits certification (Default isVerified: false)
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

        if (!title?.trim() || !issuer?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Certification title and issuer are required",
            });
        }

        // Ownership verify karo
        let targetStudentId = studentId;

        if (targetStudentId) {
            const student = await prisma.student.findUnique({
                where: { id: targetStudentId },
                select: { id: true, userId: true },
            });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                });
            }

            if (student.userId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only submit certifications for your own profile",
                });
            }
        } else {
            const student = await prisma.student.findUnique({
                where: { userId: req.user.id },
                select: { id: true },
            });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student record not found for your account",
                });
            }

            targetStudentId = student.id;
        }

        // isVerified hamesha false rahega jab tak Admin approve na kare
        const certification = await prisma.certification.create({
            data: {
                studentId: targetStudentId,
                title: title.trim(),
                issuer: issuer.trim(),
                credentialId: credentialId?.trim() || null,
                credentialUrl: credentialUrl?.trim() || null,
                certificateUrl: certificateUrl?.trim() || null,
                issuedAt: issuedAt ? new Date(issuedAt) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isVerified: false,
                verifiedAt: null,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Certification submitted for admin verification",
            data: certification,
        });

    } catch (error) {
        console.error("Add certification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit certification",
        });
    }
};

// 2. View Certifications (Public only sees verified; Owner & Admin see all)
export const getStudentCertifications = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { id: true, userId: true },
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const isOwner = student.userId === req.user.id;
        const isAdmin = req.user.role === "ADMIN";

        // Agar viewer owner ya admin nahi hai, toh SIRF verified dikhao
        const whereClause = {
            studentId,
            ...(isOwner || isAdmin ? {} : { isVerified: true }),
        };

        const certifications = await prisma.certification.findMany({
            where: whereClause,
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

// 3. Update Certification (Only owner student)
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

        const existingCertification = await prisma.certification.findFirst({
            where: {
                id: certificationId,
                studentId,
            },
            include: {
                student: { select: { userId: true } },
            },
        });

        if (!existingCertification) {
            return res.status(404).json({
                success: false,
                message: "Certification not found",
            });
        }

        if (existingCertification.student.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own certifications",
            });
        }

        // Details change hone par verification dobara pending ho jayegi
        const certification = await prisma.certification.update({
            where: { id: certificationId },
            data: {
                ...(title !== undefined && { title: title.trim() }),
                ...(issuer !== undefined && { issuer: issuer.trim() }),
                ...(credentialId !== undefined && { credentialId: credentialId?.trim() || null }),
                ...(credentialUrl !== undefined && { credentialUrl: credentialUrl?.trim() || null }),
                ...(certificateUrl !== undefined && { certificateUrl: certificateUrl?.trim() || null }),
                ...(issuedAt !== undefined && { issuedAt: issuedAt ? new Date(issuedAt) : null }),
                ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
                isVerified: false,
                verifiedAt: null,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Certification updated and resubmitted for verification",
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

// 4. Delete Certification (Only owner student)
export const deleteCertification = async (req, res) => {
    try {
        const { studentId, certificationId } = req.params;

        const existingCertification = await prisma.certification.findFirst({
            where: {
                id: certificationId,
                studentId,
            },
            include: {
                student: { select: { userId: true } },
            },
        });

        if (!existingCertification) {
            return res.status(404).json({
                success: false,
                message: "Certification not found",
            });
        }

        if (existingCertification.student.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own certifications",
            });
        }

        await prisma.certification.delete({
            where: { id: certificationId },
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

// 5. Admin Verify Endpoint (Only Admin can call)
export const verifyCertification = async (req, res) => {
    try {
        const { studentId, certificationId } = req.params;
        const { isVerified } = req.body;

        const existingCertification = await prisma.certification.findFirst({
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

        const approved = typeof isVerified === "boolean" ? isVerified : true;

        const updatedCertification = await prisma.certification.update({
            where: { id: certificationId },
            data: {
                isVerified: approved,
                verifiedAt: approved ? new Date() : null,
            },
        });

        return res.status(200).json({
            success: true,
            message: approved
                ? "Certification verified successfully and is now live on student profile"
                : "Certification verification revoked",
            data: updatedCertification,
        });

    } catch (error) {
        console.error("Verify certification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify certification",
        });
    }
};