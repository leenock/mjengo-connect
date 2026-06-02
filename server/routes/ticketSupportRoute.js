import { Router } from "express";
import { createReply, getReplies } from "../controllers/ticketSupportReply.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";

const router = Router();

// POST /api/admin/support/tickets/:id/reply
router.post("/:id/reply", adminAuthMiddleware, createReply);

// GET /api/admin/support/tickets/:id/replies
router.get("/:id/replies", adminAuthMiddleware, getReplies);

export default router;
