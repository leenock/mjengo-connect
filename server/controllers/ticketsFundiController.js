import {
  createFundiSupportTicket,
  getAllFundiSupportTickets,
  getFundiSupportTicketById,
  updateFundiSupportTicket,
  deleteFundiSupportTicket,
  getSupportTicketsByFundiUser,
} from "../services/fundiTickets.js"

/**
 * Handles the creation of a new support ticket for fundi users.
 * @param {Object} req - The request object containing ticket data.
 * @param {Object} res - The response object to send back the result.
 */
export const createFundiSupportTicketController = async (req, res) => {
  try {
    const newTicket = await createFundiSupportTicket(req.body)
    res.status(201).json({
      message: "Fundi support ticket created successfully",
      ticket: newTicket,
    })
  } catch (error) {
    console.error("Create Fundi Support Ticket Error:", error)
    res.status(400).json({
      error: error.message || "Internal server error",
    })
  }
}

/**
 * Handles retrieving all fundi support tickets with optional filtering.
 */
export const getAllFundiSupportTicketsController = async (req, res) => {
  try {
    const { status, priority, fundiId } = req.query
    const filters = {}

    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (fundiId) filters.fundiId = fundiId

    const tickets = await getAllFundiSupportTickets(filters)
    res.status(200).json({
      message: "Fundi support tickets retrieved successfully",
      tickets,
      count: tickets.length,
    })
  } catch (error) {
    console.error("Get All Fundi Support Tickets Error:", error)
    res.status(500).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles retrieving a single fundi support ticket by ID.
 */
export const getFundiSupportTicketByIdController = async (req, res) => {
  const { id } = req.params
  try {
    const ticket = await getFundiSupportTicketById(id)
    res.status(200).json({
      message: "Fundi support ticket retrieved successfully",
      ticket,
    })
  } catch (error) {
    console.error("Get Fundi Support Ticket By ID Error:", error)
    res.status(404).json({
      message: error.message || "Support ticket not found",
    })
  }
}

/**
 * Handles updating a fundi support ticket.
 */
export const updateFundiSupportTicketController = async (req, res) => {
  const { id } = req.params
  try {
    const updatedTicket = await updateFundiSupportTicket(id, req.body)
    res.status(200).json({
      message: "Fundi support ticket updated successfully",
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error("Update Fundi Support Ticket Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles deleting a fundi support ticket.
 */
export const deleteFundiSupportTicketController = async (req, res) => {
  const { id } = req.params
  try {
    const result = await deleteFundiSupportTicket(id)
    res.status(200).json(result)
  } catch (error) {
    console.error("Delete Fundi Support Ticket Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles retrieving support tickets for a specific fundi user.
 */
export const getSupportTicketsByFundiUserController = async (req, res) => {
  const { fundiId } = req.params
  try {
    const tickets = await getSupportTicketsByFundiUser(fundiId)
    res.status(200).json({
      message: "Fundi support tickets retrieved successfully",
      tickets,
      count: tickets.length,
    })
  } catch (error) {
    console.error("Get Support Tickets By Fundi User Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}
