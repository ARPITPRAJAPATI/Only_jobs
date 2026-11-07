import prisma from "../config/prisma.js";

// 1. Add Project (Only owner student)
export const addProject = async (req, res) => {
    try {
        const {
            studentId,
            title,
            tagline,
            description,
            githubUrl,
            demoUrl,
            techStack,
            isPinned,
        } = req.body;

        // Validation
        if (
            !title?.trim() ||
            !description?.trim() ||
            !Array.isArray(techStack) ||
            !techStack.every((tech) => typeof tech === "string")
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid project title, description and techStack",
            });
        }

        // Resolve student & verify ownership
        let targetStudentId = studentId;

        if (targetStudentId) {
            const student = await prisma.student.findUnique({
                where: { id: targetStudentId },
                select: { id: true, userId: true },
            });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student record not found",
                });
            }

            if (student.userId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only add projects to your own profile",
                });
            }
        } else {
            // If studentId was not provided in body, find it from logged-in user
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

        const project = await prisma.project.create({
            data: {
                studentId: targetStudentId,
                title: title.trim(),
                tagline: tagline?.trim() || null,
                description: description.trim(),
                githubUrl: githubUrl?.trim() || null,
                demoUrl: demoUrl?.trim() || null,
                techStack,
                isPinned: typeof isPinned === "boolean" ? isPinned : false,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Project added successfully",
            data: project,
        });

    } catch (error) {
        console.error("Add project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add project",
        });
    }
};

// 2. Get All Student Projects (All authenticated users)
export const getStudentProjects = async (req, res) => {
    try {
        const { studentId } = req.params;

        const projects = await prisma.project.findMany({
            where: {
                studentId,
            },
            orderBy: [
                { isPinned: "desc" },
                { createdAt: "desc" },
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            data: projects,
        });

    } catch (error) {
        console.error("Get projects error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};

// 3. Update Project (Only owner student)
export const updateProject = async (req, res) => {
    try {
        const { studentId, projectId } = req.params;

        const {
            title,
            tagline,
            description,
            githubUrl,
            demoUrl,
            techStack,
            isPinned,
        } = req.body;

        // Validate supplied fields
        if (
            (title !== undefined && (typeof title !== "string" || !title.trim())) ||
            (description !== undefined && (typeof description !== "string" || !description.trim())) ||
            (techStack !== undefined && (!Array.isArray(techStack) || !techStack.every((t) => typeof t === "string")))
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid project details",
            });
        }

        // Verify project exists and belongs to the requested student
        const existingProject = await prisma.project.findFirst({
            where: {
                id: projectId,
                studentId,
            },
            include: {
                student: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Strict ownership check
        if (existingProject.student.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own projects",
            });
        }

        const project = await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                ...(title !== undefined && { title: title.trim() }),
                ...(tagline !== undefined && { tagline: tagline?.trim() || null }),
                ...(description !== undefined && { description: description.trim() }),
                ...(githubUrl !== undefined && { githubUrl: githubUrl?.trim() || null }),
                ...(demoUrl !== undefined && { demoUrl: demoUrl?.trim() || null }),
                ...(techStack !== undefined && { techStack }),
                ...(typeof isPinned === "boolean" && { isPinned }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project,
        });

    } catch (error) {
        console.error("Update project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update project",
        });
    }
};

// 4. Delete Project (Only owner student)
export const deleteProject = async (req, res) => {
    try {
        const { studentId, projectId } = req.params;

        const existingProject = await prisma.project.findFirst({
            where: {
                id: projectId,
                studentId,
            },
            include: {
                student: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Strict ownership check
        if (existingProject.student.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own projects",
            });
        }

        await prisma.project.delete({
            where: {
                id: projectId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });

    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete project",
        });
    }
};
