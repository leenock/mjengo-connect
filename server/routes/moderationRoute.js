import express from "express";
import { getModerationCountsController } from "../controllers/moderationController.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/counts", adminAuthMiddleware, getModerationCountsController);

export default router;
