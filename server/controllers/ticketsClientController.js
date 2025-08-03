import {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
  getSupportTicketsByClientUser,
} from "../services/tickets.js"

/**
 * Handles the creation of a new support ticket.
 * @param {Object} req - The request object containing ticket data.
 * @param {Object} res - The response object to send back the result.
 */
export const createSupportTicketController = async (req, res) => {
  try {
    const newTicket = await createSupportTicket(req.body)
    res.status(201).json({
      message: "Support ticket created successfully",
      ticket: newTicket,
    })
  } catch (error) {
    console.error("Create Support Ticket Error:", error)
    res.status(400).json({
      error: error.message || "Internal server error",
    })
  }
}

/**
 * Handles retrieving all support tickets with optional filtering.
 */
export const getAllSupportTicketsController = async (req, res) => {
  try {
    const { status, priority, clientUserId } = req.query
    const filters = {}

    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (clientUserId) filters.clientUserId = clientUserId

    const tickets = await getAllSupportTickets(filters)
    res.status(200).json({
      message: "Support tickets retrieved successfully",
      tickets,
      count: tickets.length,
    })
  } catch (error) {
    console.error("Get All Support Tickets Error:", error)
    res.status(500).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles retrieving a single support ticket by ID.
 */
export const getSupportTicketByIdController = async (req, res) => {
  const { id } = req.params
  try {
    const ticket = await getSupportTicketById(id)
    res.status(200).json({
      message: "Support ticket retrieved successfully",
      ticket,
    })
  } catch (error) {
    console.error("Get Support Ticket By ID Error:", error)
    res.status(404).json({
      message: error.message || "Support ticket not found",
    })
  }
}

/**
 * Handles updating a support ticket.
 */
export const updateSupportTicketController = async (req, res) => {
  const { id } = req.params
  try {
    const updatedTicket = await updateSupportTicket(id, req.body)
    res.status(200).json({
      message: "Support ticket updated successfully",
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error("Update Support Ticket Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles deleting a support ticket.
 */
export const deleteSupportTicketController = async (req, res) => {
  const { id } = req.params
  try {
    const result = await deleteSupportTicket(id)
    res.status(200).json(result)
  } catch (error) {
    console.error("Delete Support Ticket Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles retrieving support tickets for a specific client user.
 */
export const getSupportTicketsByClientUserController = async (req, res) => {
  const { clientUserId } = req.params
  try {
    const tickets = await getSupportTicketsByClientUser(clientUserId)
    res.status(200).json({
      message: "Client support tickets retrieved successfully",
      tickets,
      count: tickets.length,
    })
  } catch (error) {
    console.error("Get Support Tickets By Client User Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}
