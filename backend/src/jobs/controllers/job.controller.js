import prisma from "../../config/prisma.js";

/**
 * =========================================================================
 * AGENT 1: RAW INGESTION CONTROLLER (Crawler / Scraper Bot)
 * =========================================================================
 * Scraper kisi bhi site (LinkedIn, Wellfound, Greenhouse, Lever, etc.) se raw data
 * scrape karke is endpoint par dump karta hai (Status: PENDING).
 * Supports both single object and bulk array payloads.
 */
export async function ingestRawJobPosting(req, res) {
    try {
        const payload = req.body;

        // Support for single or batch scraping
        const items = Array.isArray(payload) ? payload : [payload];

        if (items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No job postings provided in payload",
            });
        }

        // Validate each item
        const validRecords = [];
        for (const item of items) {
            if (!item.source || !item.rawPayload) {
                return res.status(400).json({
                    success: false,
                    message: "Each raw job must have 'source' and 'rawPayload'",
                });
            }
            validRecords.push({
                source: item.source.trim(),
                rawPayload: item.rawPayload,
                status: "PENDING",
            });
        }

        // Batch insert into RawJobPosting staging table
        const createdCount = await prisma.rawJobPosting.createMany({
            data: validRecords,
        });

        return res.status(201).json({
            success: true,
            message: `Successfully ingested ${createdCount.count} raw job posting(s) for processing`,
            count: createdCount.count,
        });
    } catch (error) {
        console.error("[ingestRawJobPosting Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to ingest raw job postings",
            error: error.message,
        });
    }
}

/**
 * =========================================================================
 * AGENT 2: FETCH PENDING RAW JOBS (LLM / Normalizer Bot)
 * =========================================================================
 * Normalizer / Curation Agent yahan se unparsed raw records uthata hai.
 */
export async function getPendingRawJobs(req, res) {
    try {
        const { limit = 10 } = req.query;
        const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

        const pendingJobs = await prisma.rawJobPosting.findMany({
            where: { status: "PENDING" },
            take,
            orderBy: { createdAt: "asc" }, // FIFO order
        });

        return res.status(200).json({
            success: true,
            count: pendingJobs.length,
            data: pendingJobs,
        });
    } catch (error) {
        console.error("[getPendingRawJobs Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending raw jobs",
            error: error.message,
        });
    }
}

/**
 * =========================================================================
 * AGENT 2: PUBLISH CURATED JOB (Creates clean OffCampusJob)
 * =========================================================================
 * Agent jab raw payload se fields extract kar leta hai, toh yahan post karta hai.
 * Ek hi atomic transaction me clean OffCampusJob create hota hai aur 
 * corresponding RawJobPosting ka status PROCESSED ho jata hai.
 */
export async function publishCuratedJob(req, res) {
    try {
        const {
            rawJobId,          // optional: UUID of raw posting being processed
            company,
            role,
            type = "FULL_TIME", // FULL_TIME | INTERNSHIP
            compensation,
            location,
            batchEligible,
            deadline,
            requiredSkills = [],
            portalSource,
            applyUrl,
            isHot = false,
        } = req.body;

        // Basic validations
        if (!company || !role || !applyUrl || !deadline) {
            return res.status(400).json({
                success: false,
                message: "Missing mandatory fields: company, role, applyUrl, and deadline are required",
            });
        }

        // Auto-generate 2-letter logo badge if not provided
        const logoLetter = company.trim().slice(0, 2).toUpperCase();

        // Transaction: Create clean job + update staging record
        const result = await prisma.$transaction(async (tx) => {
            const cleanJob = await tx.offCampusJob.create({
                data: {
                    company: company.trim(),
                    logoLetter,
                    role: role.trim(),
                    type: type.toUpperCase() === "INTERNSHIP" ? "INTERNSHIP" : "FULL_TIME",
                    compensation: compensation ? compensation.trim() : "Best in Industry",
                    location: location ? location.trim() : "Pan India / Remote",
                    batchEligible: batchEligible ? batchEligible.trim() : "All Batches",
                    deadline: new Date(deadline),
                    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
                    portalSource: portalSource ? portalSource.trim() : "External Portal",
                    applyUrl: applyUrl.trim(),
                    isHot: Boolean(isHot),
                },
            });

            // Agar raw job ID di gayi hai, mark it as PROCESSED
            if (rawJobId) {
                await tx.rawJobPosting.update({
                    where: { id: rawJobId },
                    data: {
                        status: "PROCESSED",
                        publishedJobId: cleanJob.id,
                        errorLog: null,
                    },
                });
            }

            return cleanJob;
        });

        return res.status(201).json({
            success: true,
            message: "Curated off-campus job published successfully",
            data: result,
        });
    } catch (error) {
        console.error("[publishCuratedJob Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to publish curated off-campus job",
            error: error.message,
        });
    }
}

/**
 * =========================================================================
 * AGENT 2 / ADMIN: UPDATE RAW JOB STATUS (Reject or Mark Failed)
 * =========================================================================
 * Agar raw posting spam hai, non-tech role hai, ya scraper corrupt payload laya hai,
 * agent is endpoint par use REJECTED ya FAILED mark kar deta hai.
 */
export async function updateRawJobStatus(req, res) {
    try {
        const { id } = req.params;
        const { status, errorLog } = req.body;

        if (!["PENDING", "PROCESSED", "FAILED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed: PENDING, PROCESSED, FAILED, REJECTED",
            });
        }

        const updated = await prisma.rawJobPosting.update({
            where: { id },
            data: {
                status,
                errorLog: errorLog || null,
            },
        });

        return res.status(200).json({
            success: true,
            message: `Raw posting status updated to ${status}`,
            data: updated,
        });
    } catch (error) {
        console.error("[updateRawJobStatus Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update raw job posting status",
            error: error.message,
        });
    }
}

 * ============================================================================
 * 1. GET /api/jobs/drives
 * Paginated On-Campus Placement Drives + Cumulative CGPA & Branch Eligibility
 * ============================================================================
 */
export async function getJobDrives(req, res) {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;

        const {
            page = 1,
            limit = 12,
            search,
            category,
        } = req.query;

        // Pagination calculation
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
        const skip = (pageNum - 1) * take;

        const where = { isActive: true };

        // Category Filter (SDE | INTERN | DATA | DEVOPS)
        if (category && category !== "ALL") {
            where.category = { equals: category, mode: "insensitive" };
        }

        // Search Filter (Company, Role, ya Required Track)
        if (search && search.trim() !== "") {
            const query = search.trim();
            where.OR = [
                { company: { contains: query, mode: "insensitive" } },
                { role: { contains: query, mode: "insensitive" } },
                { requiredTrack: { contains: query, mode: "insensitive" } },
            ];
        }

        // Student Profile: Saare completed semesters fetch karo (Cumulative CGPA calculation)
        const studentPromise = (userId && userRole === "STUDENT")
            ? prisma.student.findUnique({
                where: { userId },
                include: {
                    academicRecords: {
                        select: {
                            semester: true,
                            sgpa: true,
                            cgpa: true,
                            backlogs: true,
                        },
                        orderBy: { semester: "desc" },
                    },
                    jobApplications: {
                        select: { driveId: true },
                    },
                },
            })
            : Promise.resolve(null);

        const [drives, totalDrives, student] = await Promise.all([
            prisma.jobDrive.findMany({
                where,
                skip,
                take,
                orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
            }),
            prisma.jobDrive.count({ where }),
            studentPromise,
        ]);

        // Cumulative CGPA & Backlogs Parsing
        let studentData = null;
        let appliedDriveIds = new Set();

        if (student) {
            const records = student.academicRecords;
            const latestRecord = records[0];

            let cumulativeCgpa = 0;
            if (records.length > 0) {
                if (latestRecord?.cgpa && latestRecord.cgpa > 0) {
                    cumulativeCgpa = latestRecord.cgpa; // Official verified cumulative CGPA
                } else {
                    const totalSgpaSum = records.reduce((sum, r) => sum + r.sgpa, 0);
                    cumulativeCgpa = parseFloat((totalSgpaSum / records.length).toFixed(2));
                }
            }

            studentData = {
                id: student.id,
                branch: student.branch?.toUpperCase(),
                cgpa: cumulativeCgpa,
                activeBacklogs: latestRecord?.backlogs || 0,
            };
            appliedDriveIds = new Set(student.jobApplications.map((app) => app.driveId));
        }

        // Real-Time Eligibility Mapping
        const formattedDrives = drives.map((drive) => {
            let isEligible = true;
            const ineligibilityReasons = [];

            if (studentData) {
                // 1. Branch check
                const allowedUpper = drive.allowedBranches.map((b) => b.toUpperCase());
                if (!allowedUpper.includes(studentData.branch)) {
                    isEligible = false;
                    ineligibilityReasons.push(`Branch '${studentData.branch}' is not eligible for this role.`);
                }

                // 2. Cumulative CGPA check
                if (studentData.cgpa < drive.cgpaCutoff) {
                    isEligible = false;
                    ineligibilityReasons.push(`Cumulative CGPA ${studentData.cgpa.toFixed(2)} is below required cutoff of ${drive.cgpaCutoff}.`);
                }

                // 3. Backlogs check
                if (studentData.activeBacklogs > drive.maxBacklogs) {
                    isEligible = false;
                    ineligibilityReasons.push(`Active backlogs (${studentData.activeBacklogs}) exceed maximum allowed (${drive.maxBacklogs}).`);
                }
            }

            const hasApplied = appliedDriveIds.has(drive.id);

            return {
                id: drive.id,
                company: drive.company,
                logoLetter: drive.logoLetter,
                role: drive.role,
                type: drive.type === "FULL_TIME" ? "Full-time" : "Internship",
                category: drive.category,
                ctc: drive.ctc,
                ctcLpa: drive.ctcLpa,
                isDreamCompany: drive.isDreamCompany,
                location: drive.location,
                deadline: drive.deadline.toISOString().split("T")[0],
                cgpaCutoff: drive.cgpaCutoff,
                allowedBranches: drive.allowedBranches,
                maxBacklogs: drive.maxBacklogs,
                batch: drive.batch,
                requiredTrack: drive.requiredTrack,
                description: drive.description,
                isEligible: studentData ? isEligible : true,
                ineligibilityReasons,
                hasApplied,
            };
        });

        return res.status(200).json({
            success: true,
            data: formattedDrives,
            pagination: {
                page: pageNum,
                limit: take,
                total: totalDrives,
                totalPages: Math.ceil(totalDrives / take) || 1,
            },
        });
    } catch (error) {
        console.error("[getJobDrives Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve on-campus job drives",
            error: error.message,
        });
    }
}

/**
 * ============================================================================
 * 2. GET /api/jobs/offcampus
 * Curated Off-Campus Opportunities (External Apply Links)
 * ============================================================================
 */
export async function getOffCampusJobs(req, res) {
    try {
        const {
            page = 1,
            limit = 12,
            search,
        } = req.query;

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
        const skip = (pageNum - 1) * take;

        const where = {};

        if (search && search.trim() !== "") {
            const query = search.trim();
            where.OR = [
                { company: { contains: query, mode: "insensitive" } },
                { role: { contains: query, mode: "insensitive" } },
                { requiredSkills: { has: query } },
            ];
        }

        const [jobs, totalJobs] = await Promise.all([
            prisma.offCampusJob.findMany({
                where,
                skip,
                take,
                orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
            }),
            prisma.offCampusJob.count({ where }),
        ]);

        const formattedJobs = jobs.map((job) => ({
            id: job.id,
            company: job.company,
            logoLetter: job.logoLetter,
            role: job.role,
            type: job.type === "FULL_TIME" ? "Full-time" : "Internship",
            compensation: job.compensation,
            location: job.location,
            batchEligible: job.batchEligible,
            deadline: job.deadline.toISOString().split("T")[0],
            requiredSkills: job.requiredSkills,
            portalSource: job.portalSource,
            applyUrl: job.applyUrl,
            isHot: job.isHot,
        }));

        return res.status(200).json({
            success: true,
            data: formattedJobs,
            pagination: {
                page: pageNum,
                limit: take,
                total: totalJobs,
                totalPages: Math.ceil(totalJobs / take) || 1,
            },
        });
    } catch (error) {
        console.error("[getOffCampusJobs Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve off-campus jobs",
            error: error.message,
        });
    }
}

/**
 * ============================================================================
 * 3. GET /api/jobs/recommended
 * Smart Matching: Student ke skills aur year ke hisaab se recommendations
 * ============================================================================
 */
export async function getRecommendedJobs(req, res) {
    try {
        const userId = req.user?.id;

        // Logged-in student ke skills aur branch fetch karo
        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                projects: {
                    select: { techStack: true },
                },
            },
        });

        // Student's unified skill pool
        const studentSkills = new Set(
            student?.projects?.flatMap((p) => p.techStack?.map((s) => s.toLowerCase())) || []
        );

        // Fetch top active drives
        const drives = await prisma.jobDrive.findMany({
            where: { isActive: true },
            take: 6,
            orderBy: [{ ctcLpa: "desc" }],
        });

        const recommendations = drives.map((drive) => {
            const matchReasons = [];
            const skillsMatched = [];

            if (student && drive.allowedBranches.includes(student.branch)) {
                matchReasons.push(`Eligible for your branch (${student.branch})`);
            }

            if (drive.isDreamCompany) {
                matchReasons.push("High-tier Dream Opportunity (₹20+ LPA CTC)");
            }

            if (drive.requiredTrack) {
                skillsMatched.push(drive.requiredTrack);
            }

            return {
                id: drive.id,
                company: drive.company,
                logoLetter: drive.logoLetter,
                role: drive.role,
                type: "TPO_DRIVE",
                compensation: drive.ctc,
                matchReasons: matchReasons.length > 0 ? matchReasons : ["High demand campus recruitment"],
                skillsMatched,
                originalDriveId: drive.id,
            };
        });

        return res.status(200).json({
            success: true,
            data: recommendations,
        });
    } catch (error) {
        console.error("[getRecommendedJobs Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to compute recommended jobs",
            error: error.message,
        });
    }
}

/**
 * ============================================================================
 * 4. GET /api/jobs/applications
 * Logged-in Student ke On-Campus Applications (Clean 5-Stage Tracker)
 * ============================================================================
 */
export async function getStudentApplications(req, res) {
    try {
        const userId = req.user?.id;

        const student = await prisma.student.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student record not found",
            });
        }

        const applications = await prisma.jobApplication.findMany({
            where: { studentId: student.id },
            include: {
                drive: true,
            },
            orderBy: [{ createdAt: "desc" }],
        });

        const formattedApplications = applications.map((app) => ({
            id: app.id,
            driveId: app.driveId,
            company: app.drive.company,
            role: app.drive.role,
            ctc: app.drive.ctc,
            appliedDate: app.createdAt.toISOString().split("T")[0],
            currentStage: app.currentStage, // APPLIED | OA_SHORTLISTED | TECHNICAL_INTERVIEW | HR_ROUND | OFFERED | REJECTED
            isOfferAccepted: app.isOfferAccepted,
        }));

        return res.status(200).json({
            success: true,
            data: formattedApplications,
        });
    } catch (error) {
        console.error("[getStudentApplications Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve job applications",
            error: error.message,
        });
    }
}

/**
 * ============================================================================
 * 5. POST /api/jobs/drives/:driveId/apply
 * 1-Click Apply: Automated Policy Check (1-Job Offer Lock + Eligibility)
 * ============================================================================
 */
export async function applyToJobDrive(req, res) {
    try {
        const userId = req.user?.id;
        const { driveId } = req.params;

        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                academicRecords: {
                    select: { semester: true, sgpa: true, cgpa: true, backlogs: true },
                    orderBy: { semester: "desc" },
                },
                jobApplications: {
                    include: { drive: true },
                },
            },
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Only verified students can apply to placement drives.",
            });
        }

        // Fetch drive
        const drive = await prisma.jobDrive.findUnique({
            where: { id: driveId },
        });

        if (!drive || !drive.isActive) {
            return res.status(404).json({
                success: false,
                message: "Drive is not active or no longer accepting applications.",
            });
        }

        // Deadline check
        if (new Date() > new Date(drive.deadline)) {
            return res.status(400).json({
                success: false,
                message: "Application deadline for this drive has passed.",
            });
        }

        // Already applied check
        const existingApp = student.jobApplications.find((a) => a.driveId === driveId);
        if (existingApp) {
            return res.status(400).json({
                success: false,
                message: "You have already applied to this placement drive.",
            });
        }

        // College 1-Offer Placement Policy Enforcement:
        // Agar student ke paas already accepted offer hai, toh wo sirf tab apply kar sakta hai jab nayi company "Dream Company" ho!
        const acceptedOffer = student.jobApplications.find((a) => a.isOfferAccepted);
        if (acceptedOffer) {
            if (!drive.isDreamCompany || drive.ctcLpa < acceptedOffer.drive.ctcLpa * 1.5) {
                return res.status(403).json({
                    success: false,
                    message: "College Policy: You already have an accepted offer. You can only apply to Dream Companies offering at least 1.5x of your current package.",
                });
            }
        }

        // Compute Cumulative CGPA
        const records = student.academicRecords;
        let cumulativeCgpa = 0;
        if (records.length > 0) {
            const latest = records[0];
            cumulativeCgpa = latest.cgpa > 0
                ? latest.cgpa
                : parseFloat((records.reduce((s, r) => s + r.sgpa, 0) / records.length).toFixed(2));
        }

        const activeBacklogs = records[0]?.backlogs || 0;

        // Eligibility validation
        const allowedUpper = drive.allowedBranches.map((b) => b.toUpperCase());
        if (!allowedUpper.includes(student.branch.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: `Ineligible: Branch '${student.branch}' is not permitted for this drive.`,
            });
        }

        if (cumulativeCgpa < drive.cgpaCutoff) {
            return res.status(400).json({
                success: false,
                message: `Ineligible: Your Cumulative CGPA (${cumulativeCgpa}) is below required cutoff of ${drive.cgpaCutoff}.`,
            });
        }

        if (activeBacklogs > drive.maxBacklogs) {
            return res.status(400).json({
                success: false,
                message: `Ineligible: Active backlogs (${activeBacklogs}) exceed maximum allowed (${drive.maxBacklogs}).`,
            });
        }

        // Create Application Record
        const application = await prisma.jobApplication.create({
            data: {
                driveId: drive.id,
                studentId: student.id,
                currentStage: "APPLIED",
            },
        });

        return res.status(201).json({
            success: true,
            message: `Successfully applied to ${drive.company}! Your audited profile is forwarded to TPO.`,
            data: application,
        });
    } catch (error) {
        console.error("[applyToJobDrive Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit application",
            error: error.message,
        });
    }
}

/**
 * ============================================================================
 * 6. DELETE /api/jobs/applications/:id
 * Student withdraws an active on-campus application
 * ============================================================================
 */
export async function withdrawJobApplication(req, res) {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const student = await prisma.student.findUnique({
            where: { userId },
            select: { id: true },
        });

        const app = await prisma.jobApplication.findUnique({
            where: { id },
        });

        if (!app || app.studentId !== student?.id) {
            return res.status(404).json({
                success: false,
                message: "Application not found or unauthorized.",
            });
        }

        if (app.isOfferAccepted) {
            return res.status(400).json({
                success: false,
                message: "Cannot withdraw an accepted placement offer. Please contact TPO.",
            });
        }

        await prisma.jobApplication.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Application withdrawn successfully.",
        });
    } catch (error) {
        console.error("[withdrawJobApplication Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to withdraw application",
            error: error.message,
        });
    }
}

/**
 * ============================================================================
 * 7. PATCH /api/jobs/applications/:id/accept
 * Student accepts a rolled-out placement offer
 * ============================================================================
 */
export async function acceptJobOffer(req, res) {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const student = await prisma.student.findUnique({
            where: { userId },
            select: { id: true },
        });

        const app = await prisma.jobApplication.findUnique({
            where: { id },
            include: { drive: true },
        });

        if (!app || app.studentId !== student?.id) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        if (app.currentStage !== "OFFERED") {
            return res.status(400).json({
                success: false,
                message: "Offer is not yet rolled out for this application.",
            });
        }

        const updated = await prisma.jobApplication.update({
            where: { id },
            data: { isOfferAccepted: true },
        });

        return res.status(200).json({
            success: true,
            message: `Congratulations! Offer from ${app.drive.company} accepted. Institutional placement record locked.`,
            data: updated,
        });
    } catch (error) {
        console.error("[acceptJobOffer Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to accept offer",
            error: error.message,
        });
    }
}

/**
 * ============================================================================
 * 8. POST /api/jobs/drives
 * TPO / Admin creates new on-campus placement drive
 * ============================================================================
 */
export async function createJobDrive(req, res) {
    try {
        const {
            company,
            logoLetter = "CO",
            role,
            type = "FULL_TIME",
            category = "SDE",
            ctc,
            ctcLpa,
            isDreamCompany = false,
            location = "Pan India",
            deadline,
            cgpaCutoff = 6.0,
            allowedBranches = ["CSE", "IT", "ECE"],
            maxBacklogs = 0,
            batch,
            requiredTrack,
            description,
        } = req.body;

        if (!company || !role || !ctc || !ctcLpa || !deadline || !batch || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing mandatory fields: company, role, ctc, ctcLpa, deadline, batch, and description are required.",
            });
        }

        const newDrive = await prisma.jobDrive.create({
            data: {
                company: company.trim(),
                logoLetter: logoLetter.trim().toUpperCase(),
                role: role.trim(),
                type,
                category: category.trim().toUpperCase(),
                ctc: ctc.trim(),
                ctcLpa: parseFloat(ctcLpa),
                isDreamCompany: Boolean(isDreamCompany),
                location: location.trim(),
                deadline: new Date(deadline),
                cgpaCutoff: parseFloat(cgpaCutoff),
                allowedBranches: Array.isArray(allowedBranches) ? allowedBranches.map((b) => b.trim().toUpperCase()) : ["CSE", "IT"],
                maxBacklogs: parseInt(maxBacklogs, 10) || 0,
                batch: batch.trim(),
                requiredTrack: requiredTrack?.trim() || null,
                description: description.trim(),
            },
        });

        return res.status(201).json({
            success: true,
            message: `Placement drive for ${newDrive.company} published successfully!`,
            data: newDrive,
        });
    } catch (error) {
        console.error("[createJobDrive Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create placement drive",
            error: error.message,
        });
    }
}