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
}/**
 * GET /api/alumni/stats
 * Header metrics (total verified, total companies) aur distinct options return karta hai.
 */
export async function getAlumniStats(req, res) {
    try {
        // Parallel queries: Count + Distinct columns fetch
        const [totalVerified, allAlumni] = await Promise.all([
            prisma.alumniDirectory.count({
                where: { verifiedByTpo: true },
            }),
            prisma.alumniDirectory.findMany({
                where: { verifiedByTpo: true },
                select: {
                    company: true,
                    domain: true,
                    batch: true,
                },
            }),
        ]);

        // Duplicates remove karna using JavaScript 'Set' aur sort karna
        const uniqueCompanies = [...new Set(allAlumni.map((a) => a.company).filter(Boolean))].sort();
        const uniqueDomains = [...new Set(allAlumni.map((a) => a.domain).filter(Boolean))].sort();
        const uniqueBatches = [...new Set(allAlumni.map((a) => a.batch).filter(Boolean))].sort();

        return res.status(200).json({
            success: true,
            stats: {
                totalVerified,
                totalCompanies: uniqueCompanies.length,
                companies: ["ALL", ...uniqueCompanies],
                domains: ["ALL", ...uniqueDomains],
                batches: ["ALL", ...uniqueBatches],
            },
        });
    } catch (error) {
        console.error("[getAlumniStats Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to compute alumni stats",
            error: error.message,
        });
    }
}
/**
 * GET /api/alumni/:id
 * Single verified alumnus ki complete details ID ke basis par fetch karta hai.
 */
export async function getAlumniById(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Alumni ID is required",
            });
        }

        const alumnus = await prisma.alumniDirectory.findUnique({
            where: { id },
        });

        if (!alumnus) {
            return res.status(404).json({
                success: false,
                message: "Alumnus record not found",
            });
        }

        // Clean DTO formatting (Strict privacy: No salary, No referral slots)
        const formattedAlumnus = {
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
        };

        return res.status(200).json({
            success: true,
            data: formattedAlumnus,
        });
    } catch (error) {
        console.error("[getAlumniById Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve alumnus profile",
            error: error.message,
        });
    }
}
/**
 * POST /api/alumni
 * Naya alumni record create karta hai (TPO Admin / Ingestion Crawler ke dwara).
 */
export async function createAlumniRecord(req, res) {
    try {
        const {
            fullName,
            avatarUrl,
            company,
            role,
            batch,
            passoutYear,
            branch,
            domain,
            skills = [],
            linkedinUrl,
            verifiedByTpo = true,
            workEmail,
        } = req.body;

        // Mandatory fields validation
        if (!fullName || !company || !role || !passoutYear || !branch || !domain || !linkedinUrl) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: fullName, company, role, passoutYear, branch, domain, and linkedinUrl are mandatory.",
            });
        }

        // Auto-generate batch if missing (e.g. 2024 -> 'Class of 2024')
        const normalizedBatch = batch || `Class of ${passoutYear}`;

        const newAlumnus = await prisma.alumniDirectory.create({
            data: {
                fullName: fullName.trim(),
                avatarUrl: avatarUrl?.trim() || null,
                company: company.trim(),
                role: role.trim(),
                batch: normalizedBatch.trim(),
                passoutYear: parseInt(passoutYear, 10),
                branch: branch.trim().toUpperCase(),
                domain: domain.trim(),
                skills: Array.isArray(skills) ? skills.map((s) => s.trim()) : [],
                linkedinUrl: linkedinUrl.trim(),
                verifiedByTpo: Boolean(verifiedByTpo),
                workEmail: workEmail?.trim() || null,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Alumni record added to directory successfully",
            data: newAlumnus,
        });
    } catch (error) {
        console.error("[createAlumniRecord Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create alumni record",
            error: error.message,
        });
    }
}