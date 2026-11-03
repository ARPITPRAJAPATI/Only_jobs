import prisma from "../config/prisma.js";

export const registerStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            collegeName,
            rollNumber,
            libraryId,
            course,
            branch,
            batch,
        } = req.body;

        // 1. Basic validation
        if (!name || !email || !rollNumber || !collegeName || !course || !branch || !batch) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // 2. Create student
        const student = await prisma.student.create({
            data: {
                name,
                email,
                collegeName,
                rollNumber,
                libraryId,
                course,
                branch,
                batch,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: student,
        });

    } catch (error) {
        console.error("Student registration error:", error);

        // 3. Handle duplicate fields
        if (error.code === "P2002") {
            const field = error.meta?.target?.[0] || "Field";

            return res.status(409).json({
                success: false,
                message: `${field} already exists`,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Student registration failed",
        });
    }
};