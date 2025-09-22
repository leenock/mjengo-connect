import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Creates a new support ticket.
 * @param {Object} ticketData - The ticket data containing category, priority, message, subject, and clientId.
 * @returns {Promise<Object>} The newly created support ticket.
 * @throws {Error} If the client user doesn't exist or creation fails.
 */
export const createSupportTicket = async (ticketData) => {
  const { clientId, category, priority, message, subject } = ticketData // Changed clientUserId to clientId

  // Verify that the client user exists
  const clientUser = await prisma.client_User.findUnique({
    where: { id: clientId }, // Use clientId here
  })

  if (!clientUser) {
    throw new Error("Client user not found.")
  }

  const newTicket = await prisma.supportTicket.create({
    data: {
      category,
      priority,
      message,
      subject,
      status: "OPEN", // Default status
      clientId, // Use clientId here
    },
    include: {
      client: {
        // Changed clientUser to client to match schema relation name
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          company: true,
        },
      },
    },
  })

  return newTicket
}

/**
 * Retrieves all support tickets with optional filtering.
 * @param {Object} filters - Optional filters for status, priority, etc.
 * @returns {Promise<Array>} Array of support tickets.
 */
export const getAllSupportTickets = async (filters = {}) => {
  const { status, priority, clientId } = filters // Changed clientUserId to clientId

  const whereClause = {}

  if (status) whereClause.status = status
  if (priority) whereClause.priority = priority
  if (clientId) whereClause.clientId = clientId // Use clientId here

  try {
    const tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      include: {
        client: {
          // Changed clientUser to client
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return tickets
  } catch (error) {
    console.error("Error fetching support tickets:", error)
    throw new Error("Failed to fetch support tickets")
  }
}

/**
 * Retrieves a support ticket by ID.
 * @param {string} id - The ID of the support ticket.
 * @returns {Promise<Object>} The support ticket object.
 * @throws {Error} If the ticket is not found.
 */
export const getSupportTicketById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          company: true,
        },
      },
    },
  })

  if (!ticket) {
    throw new Error("Support ticket not found")
  }

  return ticket
}

/**
 * Updates a support ticket.
 * @param {string} id - The ID of the support ticket.
 * @param {Object} updateData - The data to update.
 * @returns {Promise<Object>} The updated support ticket.
 * @throws {Error} If the ticket is not found or update fails.
 */
export const updateSupportTicket = async (id, updateData) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const existingTicket = await prisma.supportTicket.findUnique({
    where: { id },
  })

  if (!existingTicket) {
    throw new Error("Support ticket not found")
  }

  const updatedTicket = await prisma.supportTicket.update({
    where: { id },
    data: {
      ...updateData,
      updatedAt: new Date(),
    },
    include: {
      client: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          company: true,
        },
      },
    },
  })

  return updatedTicket
}

/**
 * Deletes a support ticket by ID.
 * @param {string} id - The ID of the support ticket to delete.
 * @returns {Promise<Object>} Success message.
 * @throws {Error} If the ticket doesn't exist or ID is invalid.
 */
export const deleteSupportTicket = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const existingTicket = await prisma.supportTicket.findUnique({
    where: { id },
  })

  if (!existingTicket) {
    throw new Error("Support ticket not found")
  }

  await prisma.supportTicket.delete({
    where: { id },
  })

  return { message: "Support ticket deleted successfully" }
}

/**
 * Gets support tickets for a specific client user.
 * @param {string} clientId - The ID of the client user.
 * @returns {Promise<Array>} Array of support tickets for the client.
 */
export const getSupportTicketsByClientUser = async (clientId) => {
  if (!clientId || typeof clientId !== "string") {
    throw new Error("A valid client user ID is required")
  }

  const tickets = await prisma.supportTicket.findMany({
    where: { clientId }, // Use clientId here
    include: {
      client: {
        // Changed clientUser to client
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return tickets
}

/**
 * Assigns a support ticket to an admin.
 * @param {string} ticketId - The ID of the support ticket.
 * @param {string} assignedToId - The ID of the admin to assign the ticket to.
 * @returns {Promise<Object>} The updated support ticket.
 * @throws {Error} If the ticket or admin is not found.
 */
export const assignSupportTicket = async (ticketId, assignedToId) => {
  if (!ticketId || typeof ticketId !== "string") {
    throw new Error("A valid ticket ID is required")
  }

  if (!assignedToId || typeof assignedToId !== "string") {
    throw new Error("A valid admin ID is required")
  }

  // Verify the ticket exists
  const existingTicket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
  })

  if (!existingTicket) {
    throw new Error("Support ticket not found")
  }

  // Verify the admin exists
  const admin = await prisma.admin.findUnique({
    where: { id: assignedToId },
    select: { id: true, fullName: true, role: true, status: true },
  })

  if (!admin) {
    throw new Error("Admin not found")
  }

  if (admin.status !== "ACTIVE") {
    throw new Error("Cannot assign ticket to inactive admin")
  }

  // Update the ticket with assignment
  const updatedTicket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      assignedToId,
      status: existingTicket.status === "OPEN" ? "IN_PROGRESS" : existingTicket.status,
      updatedAt: new Date(),
    },
    include: {
      client: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          company: true,
        },
      },
      fundi: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          role: true,
        },
      },
    },
  })

  return updatedTicket
}

/**
 * Gets support ticket statistics for admin dashboard.
 * @returns {Promise<Object>} Statistics object with ticket counts.
 */
export const getSupportTicketStats = async () => {
  try {
    const [total, open, inProgress, resolved, closed, urgent] = await Promise.all([
      prisma.supportTicket.count(),
      prisma.supportTicket.count({ where: { status: "OPEN" } }),
      prisma.supportTicket.count({ where: { status: "IN_PROGRESS" } }),
      prisma.supportTicket.count({ where: { status: "RESOLVED" } }),
      prisma.supportTicket.count({ where: { status: "CLOSED" } }),
      prisma.supportTicket.count({ where: { priority: "URGENT" } }),
    ])

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      urgent,
    }
  } catch (error) {
    console.error("Error fetching support ticket stats:", error)
    throw new Error("Failed to fetch support ticket statistics")
  }
}
