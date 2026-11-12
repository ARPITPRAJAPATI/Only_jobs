import prisma from "../../config/prisma.js";
/**
 * GET /api/alumni
 * Retrieves paginated, multi-filtered list of verified alumni.
 */
export async function getAlumniList(req, res) {
    try {
        const {
            search,
            company,
            domain,
            batch,
            branch,
            page = 1,
            limit = 12,
        } = req.query;

        // Pagination calculation
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
        const skip = (pageNum - 1) * take;

        const where = {};

        // 1. Company filter
        if (company && company !== "ALL") {
            where.company = { equals: company, mode: "insensitive" };
        }

        // 2. Domain filter
        if (domain && domain !== "ALL") {
            where.domain = { equals: domain, mode: "insensitive" };
        }

        // 3. Batch filter
        if (batch && batch !== "ALL") {
            where.batch = { equals: batch, mode: "insensitive" };
        }

        // 4. Branch filter
        if (branch && branch !== "ALL") {
            where.branch = { equals: branch, mode: "insensitive" };
        }

        // 5. Search bar: Name, Company, Role, ya Skills match karega
        if (search && search.trim() !== "") {
            const query = search.trim();
            where.OR = [
                { fullName: { contains: query, mode: "insensitive" } },
                { company: { contains: query, mode: "insensitive" } },
                { role: { contains: query, mode: "insensitive" } },
                { skills: { has: query } },
            ];
        }

        // Parallel execution: Records aur Total Count ek saath
        const [alumniRecords, total] = await Promise.all([
            prisma.alumniDirectory.findMany({
                where,
                skip,
                take,
                orderBy: [
                    { passoutYear: "desc" },
                    { createdAt: "desc" },
                ],
            }),
            prisma.alumniDirectory.count({ where }),
        ]);

        // Frontend format ke according clean mapping
        const formattedAlumni = alumniRecords.map((alumnus) => ({
            id: alumnus.id,
            name: alumnus.fullName,
            avatarUrl: alumnus.avatarUrl,
            company: alumnus.company,
            role: alumnus.role,
            batch: alumnus.batch,
            passoutYear: alumnus.passoutYear,
            branch: alumnus.branch,
            domain: alumnus.domain,
            skills: alumnus.skills,
            linkedinUrl: alumnus.linkedinUrl,
            verifiedByTpo: alumnus.verifiedByTpo,
            createdAt: alumnus.createdAt,
        }));

        return res.status(200).json({
            success: true,
            data: formattedAlumni,
            pagination: {
                page: pageNum,
                limit: take,
                total,
                totalPages: Math.ceil(total / take) || 1,
            },
        });
    } catch (error) {
        console.error("[getAlumniList Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve alumni directory",
            error: error.message,
        });
    }
}