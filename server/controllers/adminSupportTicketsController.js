import {
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
  assignSupportTicket,
  getSupportTicketStats,
} from "../services/tickets.js"
import { hasPermission } from "../utils/permissions.js"

/**
 * Handles retrieving all support tickets for admin view with filtering.
 */
export const getAllSupportTicketsController = async (req, res) => {
  try {
    const { status, priority, category, assignedToId, search, page = 1, limit = 10 } = req.query
    const adminRole = req.admin?.role

    if (!hasPermission(adminRole, "support.read")) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      })
    }

    const filters = {}
    if (status && status !== "all") filters.status = status.toUpperCase()
    if (priority && priority !== "all") filters.priority = priority.toUpperCase()
    if (category && category !== "all") filters.category = category.toUpperCase()
    if (assignedToId) filters.assignedToId = assignedToId
    if (search) filters.search = search

    const tickets = await getAllSupportTickets(filters, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.status(200).json({
      message: "Support tickets retrieved successfully",
      tickets: tickets.data,
      pagination: tickets.pagination,
      totalCount: tickets.totalCount,
    })
  } catch (error) {
    console.error("Get All Support Tickets (Admin) Error:", error)
    res.status(500).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles retrieving support ticket statistics for admin dashboard.
 */
export const getSupportTicketStatsController = async (req, res) => {
  try {
    const adminRole = req.admin?.role

    if (!hasPermission(adminRole, "support.read")) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      })
    }

    const stats = await getSupportTicketStats()
    res.status(200).json({
      message: "Support ticket statistics retrieved successfully",
      stats,
    })
  } catch (error) {
    console.error("Get Support Ticket Stats Error:", error)
    res.status(500).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles retrieving a single support ticket by ID for admin view.
 */
export const getSupportTicketByIdController = async (req, res) => {
  const { id } = req.params
  try {
    const adminRole = req.admin?.role

    if (!hasPermission(adminRole, "support.read")) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      })
    }

    const ticket = await getSupportTicketById(id)
    res.status(200).json({
      message: "Support ticket retrieved successfully",
      ticket,
    })
  } catch (error) {
    console.error("Get Support Ticket By ID (Admin) Error:", error)
    res.status(404).json({
      message: error.message || "Support ticket not found",
    })
  }
}

/**
 * Handles updating a support ticket (admin operations).
 */
export const updateSupportTicketController = async (req, res) => {
  const { id } = req.params
  try {
    const adminRole = req.admin?.role

    if (!hasPermission(adminRole, "support.update")) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      })
    }

    const updatedTicket = await updateSupportTicket(id, req.body)
    res.status(200).json({
      message: "Support ticket updated successfully",
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error("Update Support Ticket (Admin) Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles assigning a support ticket to an admin.
 */
export const assignSupportTicketController = async (req, res) => {
  const { id } = req.params
  const { assignedToId } = req.body
  try {
    const adminRole = req.admin?.role
    const actingAdminId = req.admin?.id

    if (!hasPermission(adminRole, "support.assign")) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      })
    }

    // Enforce role rules:
    // - SUPER_ADMIN and ADMIN: can assign to MODERATOR, SUPPORT, ADMIN, and themselves
    // - MODERATOR and SUPPORT: cannot assign tickets to themselves
    if (adminRole === "MODERATOR" || adminRole === "SUPPORT") {
      if (assignedToId && actingAdminId && assignedToId === actingAdminId) {
        return res.status(403).json({
          message: "Moderators and Support cannot assign tickets to themselves.",
        })
      }
    }

    const updatedTicket = await assignSupportTicket(id, assignedToId)
    res.status(200).json({
      message: "Support ticket assigned successfully",
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error("Assign Support Ticket Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}

/**
 * Handles deleting a support ticket (admin only).
 */
export const deleteSupportTicketController = async (req, res) => {
  const { id } = req.params
  try {
    const adminRole = req.admin?.role

    if (!hasPermission(adminRole, "admin.delete")) {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      })
    }

    const result = await deleteSupportTicket(id)
    res.status(200).json(result)
  } catch (error) {
    console.error("Delete Support Ticket (Admin) Error:", error)
    res.status(400).json({
      message: error.message || "Internal server error",
    })
  }
}
