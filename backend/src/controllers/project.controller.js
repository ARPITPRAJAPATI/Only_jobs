
import prisma from "../config/prisma.js";

// 1. Add Project
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
        } = req.body;

        // Validation
        if (
            !studentId ||
            !title?.trim() ||
            !description?.trim() ||
            !Array.isArray(techStack) ||
            !techStack.every((tech) => typeof tech === "string")
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid project details",
            });
        }

        const project = await prisma.project.create({
            data: {
                studentId,
                title: title.trim(),
                tagline,
                description: description.trim(),
                githubUrl,
                demoUrl,
                techStack,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Project added successfully",
            data: project,
        });

    } catch (error) {
        console.error("Add project error:", error);

        if (error.code === "P2003") {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add project",
        });
    }
};


// 2. Get All Student Projects
export const getStudentProjects = async (req, res) => {
    try {
        const { studentId } = req.params;

        const projects = await prisma.project.findMany({
            where: {
                studentId,
            },
            orderBy: {
                createdAt: "desc",
            },
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


// 3. Update Project
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
        } = req.body;

        // Validate supplied fields
        if (
            (title !== undefined &&
                (typeof title !== "string" || !title.trim())) ||
            (description !== undefined &&
                (typeof description !== "string" || !description.trim())) ||
            (techStack !== undefined &&
                (!Array.isArray(techStack) ||
                    !techStack.every((tech) => typeof tech === "string")))
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid project details",
            });
        }

        const existingProject = await prisma.project.findFirst({
            where: {
                id: projectId,
                studentId,
            },
        });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const project = await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                ...(title !== undefined && { title: title.trim() }),
                ...(tagline !== undefined && { tagline }),
                ...(description !== undefined && {
                    description: description.trim(),
                }),
                ...(githubUrl !== undefined && { githubUrl }),
                ...(demoUrl !== undefined && { demoUrl }),
                ...(techStack !== undefined && { techStack }),
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


// 4. Delete Project
export const deleteProject = async (req, res) => {
    try {
        const { studentId, projectId } = req.params;

        const existingProject = await prisma.project.findFirst({
            where: {
                id: projectId,
                studentId,
            },
        });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
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
