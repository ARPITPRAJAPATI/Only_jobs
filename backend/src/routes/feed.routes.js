import { Router } from "express";
import {
    getFeedPosts,
    createPost,
    getFeedSidebarSummary,
    getCampusSignals,
    getKietNetwork,
    deletePost,
} from "../controllers/feed.controller.js";

const router = Router();

// 1. Left Profile Card Summary
router.get("/sidebar-summary", getFeedSidebarSummary);

// 2. Right Sidebar: Live Campus Signals & KIET Network
router.get("/signals", getCampusSignals);
router.get("/network", getKietNetwork);

// 3. Main Feed Posts (Fetch & Create)
router.get("/", getFeedPosts);
router.post("/", createPost);

// 4. Delete Post
router.delete("/:id", deletePost);

export default router;