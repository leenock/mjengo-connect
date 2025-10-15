import express from "express";
import {
  createFundiSupportTicketController,
  getAllFundiSupportTicketsController,
  getFundiSupportTicketByIdController,
  updateFundiSupportTicketController,
  deleteFundiSupportTicketController,
  getSupportTicketsByFundiUserController,
} from "../controllers/ticketsFundiController.js";
import { validate } from "../middleware/validate.js";
//import { authenticateToken } from "../middleware/auth.js"

import {
  authenticateFundiToken,
  //requireActiveSubscription,
  // requirePremiumSubscription,
} from "../middleware/fundiAuth.js";

import {
  createFundiSupportTicketSchema,
  updateFundiSupportTicketSchema,
} from "../utils/validation/fundiSupportTicketValidation.js";

const router = express.Router();

// Create a new fundi support ticket - requires authentication
router.post(
  "/createFundiTicket",
  authenticateFundiToken,
  validate(createFundiSupportTicketSchema),
  createFundiSupportTicketController
);

// Get all fundi support tickets (with optional filtering) - temporarily public (no auth)
router.get(
  "/getAllFundiTickets",
  getAllFundiSupportTicketsController
);

// Get a specific fundi support ticket by ID - requires authentication
router.get(
  "/getFundiTicket/:id",
  authenticateFundiToken,
  getFundiSupportTicketByIdController
);

// Update a fundi support ticket - requires authentication
router.put(
  "/updateFundiTicket/:id",
  authenticateFundiToken,
  validate(updateFundiSupportTicketSchema),
  updateFundiSupportTicketController
);

// Delete a fundi support ticket - requires authentication
router.delete(
  "/deleteFundiTicket/:id",
  authenticateFundiToken,
  deleteFundiSupportTicketController
);

// Get all support tickets for a specific fundi user - requires authentication
router.get(
  "/getFundiTickets/:fundiId",
  authenticateFundiToken,
  getSupportTicketsByFundiUserController
);

export default router;
