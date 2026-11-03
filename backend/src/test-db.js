import prisma from "./config/prisma.js";

try {
    await prisma.$connect();

    console.log("PostgreSQL connected successfully!");

    const students = await prisma.student.findMany();

    console.log("Students:", students);

} catch (error) {
    console.error("Database connection failed:", error);
} finally {
    await prisma.$disconnect();
}