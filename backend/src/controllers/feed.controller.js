import prisma from "../config/prisma.js";

/**
 * HELPER 1: formatPostAuthor
 * Formats user details based on role (Student vs Staff/Dean/Teacher).
 */
export const formatPostAuthor = (user) => {
    if (!user) {
        return {
            id: null,
            name: "Unknown User",
            subtitle: "Member",
            avatarUrl: null,
            verifiedType: null,
            isStaff: false,
            pinnedBadges: [],
        };
    }

    // 1. Agar post STUDENT ki hai
    if (user.role === "STUDENT") {
        const student = user.student;
        const profile = student?.studentProfile;
        const sem = student?.currentSemester ? ` · Sem ${student.currentSemester}` : "";
        const branch = student?.branch ? ` ${student.branch}` : "";
        const course = student?.course || "B.Tech";

        return {
            id: user.id,
            studentId: student?.id || null,
            name: student?.name || "Student",
            subtitle: `${course}${branch}${sem}`.trim(), // e.g. "B.Tech CSE · Sem 7"
            avatarUrl: profile?.avatarUrl || null,
            verifiedType: "student",
            isStaff: false,
            // Sirf wahi 2 badges jo student ne earn kiye aur pin kiye hain:
            pinnedBadges: (student?.badges || []).map((b) => ({
                id: b.id,
                title: b.title,
                imageUrl: b.imageUrl,
            })),
        };
    }

    // 2. Agar post STAFF / DEAN / TEACHER / TPO ki hai
    const staffProfile = user.staffProfile;
    const staff = user.staff;

    let position = staffProfile?.designation;
    if (!position) {
        if (user.role === "TEACHER") position = staffProfile?.department ? `Faculty, ${staffProfile.department}` : "Faculty Member";
        else if (user.role === "TPO") position = "Training & Placement Cell (CRPC)";
        else if (user.role === "ADMIN") position = "Dean of Academics / Administrator";
        else position = "Staff Member";
    }

    let verifiedType = "faculty";
    if (user.role === "ADMIN") verifiedType = "dean";
    else if (user.role === "TPO") verifiedType = "crpc";
    else if (user.role === "TEACHER") verifiedType = "faculty";

    return {
        id: user.id,
        name: staffProfile?.fullName || staff?.name || "Office of the Dean",
        subtitle: position, // e.g. "Dean of Academics"
        avatarUrl: staffProfile?.profileImage || null,
        verifiedType,
        isStaff: true,
        pinnedBadges: [], // Staff ko koi student badge nahi milta
    };
};
/**
 * HELPER 2: formatPostItem
 * Joins Author info + Complete Post Data (Content, Tags, Project, Likes, Comments)
 */
export const formatPostItem = (post) => {
    const author = formatPostAuthor(post.user);


    return {
        id: post.id,
        type: post.type, // DEAN_NOTICE | PROJECT_SHOWCASE | PLACEMENT_UPDATE | HACKATHON_WIN | GENERAL
        content: post.content, // Post ka message / notice text
        hashtags: post.hashtags || [], // ['#SIH2026', '#Hackathon']
        imageUrl: post.imageUrl || null,
        imageTag: post.imageTag || null,
        isPinned: post.isPinned || false, // Dean pinned notice
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,

        // Agar Project Showcase post hai (jaise KubePay)
        project: post.type === "PROJECT_SHOWCASE" || post.projectRepo || post.projectUrl ? {
            repoUrl: post.projectRepo || null,
            liveUrl: post.projectUrl || null,
            techStack: post.projectStack || [], // ['Go', 'Node.js', 'PostgreSQL', 'Docker', 'K8s']
        } : null,

        // Author details
        author,
    };
};

/**
 * 1. GET FEED POSTS (Stream)
 * - Pinned notices (Dean) sabse upar aati hain
 * - Phir newest posts
 * - Student ke max 2 approved pinned badges load hote hain
 */
export const getFeedPosts = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;
        const { filter } = req.query;

        // Optional filter: jaise sirf DEAN_NOTICE ya sirf PROJECT_SHOWCASE dekhna ho
        const where = {};
        if (filter && ["DEAN_NOTICE", "PROJECT_SHOWCASE", "PLACEMENT_UPDATE", "HACKATHON_WIN", "GENERAL"].includes(filter)) {
            where.type = filter;
        }

        // Pinned Dean notices ALWAYS at top, phir newest posts
        const orderBy = [
            { isPinned: "desc" },
            { createdAt: "desc" },
        ];

        const [posts, totalPosts] = await Promise.all([
            prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            role: true,
                            email: true,
                            student: {
                                select: {
                                    id: true,
                                    name: true,
                                    course: true,
                                    branch: true,
                                    currentSemester: true,
                                    studentProfile: {
                                        select: {
                                            avatarUrl: true,
                                            username: true,
                                        },
                                    },
                                    badges: {
                                        where: {
                                            isPinned: true,
                                            status: "APPROVED",
                                        },
                                        take: 2,
                                        select: {
                                            id: true,
                                            title: true,
                                            imageUrl: true,
                                        },
                                    },
                                },
                            },
                            staffProfile: {
                                select: {
                                    fullName: true,
                                    designation: true,
                                    department: true,
                                    profileImage: true,
                                },
                            },
                            staff: {
                                select: {
                                    name: true,
                                    role: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.post.count({ where }),
        ]);

        // Har post ko humare clean Helper 2 se format karo
        const formattedPosts = posts.map((post) => formatPostItem(post));

        return res.status(200).json({
            success: true,
            data: {
                posts: formattedPosts,
                pagination: {
                    page,
                    limit,
                    totalPosts,
                    totalPages: Math.ceil(totalPosts / limit),
                    hasMore: skip + posts.length < totalPosts,
                },
            },
        });
    } catch (error) {
        console.error("Error in getFeedPosts:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch feed posts",
            error: error.message,
        });
    }
};
/**
 * 2. CREATE POST
 * - Student daily quota check (Max 3 posts / day)
 * - Role permission check (Dean notice sirf Dean daal sakta hai)
 * - Project details (Repo, Live URL, Tech Stack) agar present hon
 */
export const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const {
            content,
            type = "GENERAL",
            hashtags = [],
            imageUrl,
            imageTag,
            projectRepo,
            projectUrl,
            projectStack = [],
            isPinned = false,
        } = req.body;

        // 1. Validation: Post empty nahi honi chahiye
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Post content cannot be empty",
            });
        }

        // 2. Role-based restrictions
        if (type === "DEAN_NOTICE" || isPinned) {
            if (userRole !== "ADMIN") {
                return res.status(403).json({
                    success: false,
                    message: "Only the Dean / Admin can publish official notices or pin posts",
                });
            }
        }

        if (type === "PLACEMENT_UPDATE") {
            if (userRole !== "TPO" && userRole !== "ADMIN") {
                return res.status(403).json({
                    success: false,
                    message: "Only TPO / CRPC cell can publish placement updates",
                });
            }
        }

        // 3. Student Daily Quota Check (Max 3 posts / day)
        let postsRemainingToday = null;
        if (userRole === "STUDENT") {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0); // Aaj subah 12:00 AM

            const postsTodayCount = await prisma.post.count({
                where: {
                    userId,
                    createdAt: { gte: startOfToday },
                },
            });

            if (postsTodayCount >= 3) {
                return res.status(429).json({
                    success: false,
                    message: "Daily limit reached: Maximum 3 posts allowed per day for students",
                    postsRemainingToday: 0,
                });
            }

            postsRemainingToday = 3 - (postsTodayCount + 1);
        }

        // 4. Save into Database
        const post = await prisma.post.create({
            data: {
                userId,
                type,
                content: content.trim(),
                hashtags: Array.isArray(hashtags) ? hashtags : [],
                imageUrl: imageUrl || null,
                imageTag: imageTag || null,
                projectRepo: projectRepo || null,
                projectUrl: projectUrl || null,
                projectStack: Array.isArray(projectStack) ? projectStack : [],
                isPinned: Boolean(isPinned && userRole === "ADMIN"),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        role: true,
                        email: true,
                        student: {
                            select: {
                                id: true,
                                name: true,
                                course: true,
                                branch: true,
                                currentSemester: true,
                                studentProfile: {
                                    select: { avatarUrl: true, username: true },
                                },
                                badges: {
                                    where: { isPinned: true, status: "APPROVED" },
                                    take: 2,
                                    select: { id: true, title: true, imageUrl: true },
                                },
                            },
                        },
                        staffProfile: {
                            select: {
                                fullName: true,
                                designation: true,
                                department: true,
                                profileImage: true,
                            },
                        },
                        staff: { select: { name: true, role: true } },
                    },
                },
            },
        });

        // 5. Clean format response
        const formatted = formatPostItem(post);

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: {
                post: formatted,
                postsRemainingToday, // e.g. 2 posts left today
            },
        });
    } catch (error) {
        console.error("Error in createPost:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message,
        });
    }
};
/**
 * 3. GET FEED SIDEBAR SUMMARY (Left Sidebar Card)
 * Sirf Profile Card ka Data:
 * - Initials: "AP"
 * - Name: "Arpit Prajapati"
 * - Email: "arpit.prajapati@kiet.edu"
 * - 2 BADGES | 78% TRUST | 3 PROJECTS
 * - Verified Portfolio → (/profile)
 */
export const getFeedSidebarSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === "STUDENT") {
            const student = await prisma.student.findFirst({
                where: { userId },
                include: {
                    studentProfile: {
                        select: { avatarUrl: true, username: true },
                    },
                    _count: {
                        select: {
                            projects: true,
                        },
                    },
                },
            });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student record not found",
                });
            }

            // 1. Approved Badges Count (e.g. 2 Badges)
            const badgesCount = await prisma.studentBadge.count({
                where: {
                    studentId: student.id,
                    status: "APPROVED",
                },
            });

            // 2. Initials (e.g. "Arpit Prajapati" -> "AP")
            const initials = student.name
                ? student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                : "ST";

            return res.status(200).json({
                success: true,
                data: {
                    role: "STUDENT",
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    initials, // "AP"
                    avatarUrl: student.studentProfile?.avatarUrl || null,
                    course: student.course,
                    branch: student.branch,
                    currentSemester: student.currentSemester,
                    badgesCount, // 2
                    trustScore: 78, // 78%
                    projectsCount: student._count.projects, // 3
                    profileUrl: "/profile",
                },
            });
        }

        // Agar Dean / Staff / Teacher login hai:
        const staffProfile = await prisma.staffProfile.findFirst({
            where: { userId },
        });
        const staff = await prisma.staffRegistry.findFirst({
            where: { userId },
        });

        const fullName = staffProfile?.fullName || staff?.name || "Office of the Dean";
        const initials = fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

        return res.status(200).json({
            success: true,
            data: {
                role: userRole,
                name: fullName,
                email: req.user.email,
                initials: initials || "DO",
                avatarUrl: staffProfile?.profileImage || null,
                designation: staffProfile?.designation || (userRole === "ADMIN" ? "Dean of Academics" : "Faculty Member"),
                department: staffProfile?.department || "Academic Council",
                badgesCount: 0,
                trustScore: 100,
                projectsCount: 0,
                profileUrl: "/staff/profile",
            },
        });
    } catch (error) {
        console.error("Error in getFeedSidebarSummary:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch sidebar profile summary",
            error: error.message,
        });
    }
};
/**
 * 4. GET CAMPUS SIGNALS (Right Sidebar Widget 1)
 * Matches Screenshot 3:
 * - CRPC Cell announced Amazon SDE shortlists (15m ago)
 * - Prof. Sharma verified AST complexity (1h ago)
 * - Rohan endorsed Docker & K8s skills (1D ago)
 */
export const getCampusSignals = async (req, res) => {
    try {
        let signals = await prisma.campusSignal.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
        });

        // Agar database mein abhi rows na hon, toh default live signals
        if (!signals || signals.length === 0) {
            signals = [
                {
                    id: "sig-1",
                    title: "CRPC Cell announced Amazon SDE shortlists.",
                    timeText: "15m ago",
                    category: "CRPC",
                    dotColor: "blue",
                },
                {
                    id: "sig-2",
                    title: "Prof. Sharma verified AST complexity.",
                    timeText: "1h ago",
                    category: "ACADEMIC",
                    dotColor: "green",
                },
                {
                    id: "sig-3",
                    title: "Rohan endorsed Docker & K8s skills.",
                    timeText: "1D ago",
                    category: "ENDORSEMENT",
                    dotColor: "purple",
                },
            ];
        }

        return res.status(200).json({
            success: true,
            data: signals,
        });
    } catch (error) {
        console.error("Error in getCampusSignals:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch campus signals",
            error: error.message,
        });
    }
};
/**
 * 5. GET KIET NETWORK (Right Sidebar Widget 2)
 * Matches Screenshot 4:
 * - Aman Gupta (SDE @ Atlassian · '24)
 * - Sneha Rawat (Innogeeks Lead · CSE '26)
 * - Priya Sharma (Placed @ Adobe · IT '25)
 */
export const getKietNetwork = async (req, res) => {
    try {
        const networkSuggestions = [
            {
                id: "net-1",
                name: "Aman Gupta",
                headline: "SDE @ Atlassian · '24",
                isConnected: false,
                avatarUrl: null,
            },
            {
                id: "net-2",
                name: "Sneha Rawat",
                headline: "Innogeeks Lead · CSE '26",
                isConnected: true,
                avatarUrl: null,
            },
            {
                id: "net-3",
                name: "Priya Sharma",
                headline: "Placed @ Adobe · IT '25",
                isConnected: true,
                avatarUrl: null,
            },
        ];

        return res.status(200).json({
            success: true,
            data: networkSuggestions,
        });
    } catch (error) {
        console.error("Error in getKietNetwork:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch KIET network suggestions",
            error: error.message,
        });
    }
};

/**
 * 6. DELETE POST
 * - Author can delete their own post
 * - Admin can delete any post
 */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Only author or ADMIN can delete
        if (post.userId !== userId && userRole !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post",
            });
        }

        await prisma.post.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Error in deletePost:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message,
        });
    }
};