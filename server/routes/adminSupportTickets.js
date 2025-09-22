import express from "express"
import {
  getAllSupportTicketsController,
  getSupportTicketByIdController,
  updateSupportTicketController,
  deleteSupportTicketController,
  assignSupportTicketController,
  getSupportTicketStatsController,
} from "../controllers/adminSupportTicketsController.js"
import { adminAuthMiddleware, moderatorOrHigherMiddleware } from "../middleware/adminAuth.js"
import { validate } from "../middleware/validate.js"
import { updateSupportTicketSchema } from "../utils/validation/supportTicketValidation.js"

const router = express.Router()

// Get all support tickets (admin view with filtering) - requires moderator or higher
router.get("/tickets", adminAuthMiddleware, moderatorOrHigherMiddleware, getAllSupportTicketsController)

// Get support ticket statistics - requires moderator or higher
router.get("/tickets/stats", adminAuthMiddleware, moderatorOrHigherMiddleware, getSupportTicketStatsController)

// Get a specific support ticket by ID - requires moderator or higher
router.get("/tickets/:id", adminAuthMiddleware, moderatorOrHigherMiddleware, getSupportTicketByIdController)

// Update a support ticket (status, priority, assignment) - requires moderator or higher
router.put(
  "/tickets/:id",
  adminAuthMiddleware,
  moderatorOrHigherMiddleware,
  validate(updateSupportTicketSchema),
  updateSupportTicketController,
)

// Assign a support ticket to an admin - requires moderator or higher
router.put("/tickets/:id/assign", adminAuthMiddleware, moderatorOrHigherMiddleware, assignSupportTicketController)

// Delete a support ticket - requires admin or higher
router.delete("/tickets/:id", adminAuthMiddleware, deleteSupportTicketController)

export default router
