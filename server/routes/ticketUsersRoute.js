import express from "express"
import {
  createSupportTicketController,
  getAllSupportTicketsController,
  getSupportTicketByIdController,
  updateSupportTicketController,
  deleteSupportTicketController,
  getSupportTicketsByClientUserController,
} from "../controllers/ticketsClientController.js"
import { validate } from "../middleware/validate.js"
import { authenticateToken } from "../middleware/auth.js" // Updated import path
import { adminAuthMiddleware } from "../middleware/adminAuth.js"
import { createSupportTicketSchema, updateSupportTicketSchema } from "../utils/validation/supportTicketValidation.js"

const router = express.Router()

// Create a new support ticket - requires authentication
router.post("/createTicket", authenticateToken, validate(createSupportTicketSchema), createSupportTicketController)

// Get all support tickets (with optional filtering) - temporarily public (no auth)
router.get("/getAllTickets", adminAuthMiddleware, getAllSupportTicketsController)

// Get a specific support ticket by ID - requires authentication
router.get("/getTicket/:id", authenticateToken, getSupportTicketByIdController)

// Update a support ticket - requires authentication
router.put("/updateTicket/:id", authenticateToken, validate(updateSupportTicketSchema), updateSupportTicketController)

// Delete a support ticket - requires authentication
router.delete("/deleteTicket/:id", authenticateToken, deleteSupportTicketController)

// Get all support tickets for a specific client user - requires authentication
router.get("/getClientTickets/:clientUserId", authenticateToken, getSupportTicketsByClientUserController)

export default router
