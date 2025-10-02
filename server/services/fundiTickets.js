import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Creates a new support ticket for a fundi user.
 * @param {Object} ticketData - The ticket data containing category, priority, message, subject, and fundiId.
 * @returns {Promise<Object>} The newly created support ticket.
 * @throws {Error} If the fundi user doesn't exist or creation fails.
 */
export const createFundiSupportTicket = async (ticketData) => {
  const { fundiId, category, priority, message, subject } = ticketData

  // Verify that the fundi user exists
  const fundiUser = await prisma.fundi_User.findUnique({
    where: { id: fundiId },
  })

  if (!fundiUser) {
    throw new Error("Fundi user not found.")
  }

  const newTicket = await prisma.supportTicket.create({
    data: {
      category,
      priority,
      message,
      subject,
      status: "OPEN", // Default status
      fundiId,
    },
    include: {
      fundi: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          primary_skill: true,
          experience_level: true,
        },
      },
    },
  })

  return newTicket
}

/**
 * Retrieves all support tickets with optional filtering for fundi users.
 * @param {Object} filters - Optional filters for status, priority, etc.
 * @returns {Promise<Array>} Array of support tickets.
 */
export const getAllFundiSupportTickets = async (filters = {}) => {
  const { status, priority, fundiId } = filters

  const whereClause = {}

  if (status) whereClause.status = status
  if (priority) whereClause.priority = priority
  if (fundiId) whereClause.fundiId = fundiId

  try {
    const tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      include: {
        fundi: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            primary_skill: true,
            experience_level: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return tickets
  } catch (error) {
    console.error("Error fetching fundi support tickets:", error)
    throw new Error("Failed to fetch fundi support tickets")
  }
}

/**
 * Retrieves a support ticket by ID for fundi users.
 * @param {string} id - The ID of the support ticket.
 * @returns {Promise<Object>} The support ticket object.
 * @throws {Error} If the ticket is not found.
 */
export const getFundiSupportTicketById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      fundi: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          primary_skill: true,
          experience_level: true,
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
 * Updates a support ticket for fundi users.
 * @param {string} id - The ID of the support ticket.
 * @param {Object} updateData - The data to update.
 * @returns {Promise<Object>} The updated support ticket.
 * @throws {Error} If the ticket is not found or update fails.
 */
export const updateFundiSupportTicket = async (id, updateData) => {
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
      fundi: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          primary_skill: true,
          experience_level: true,
        },
      },
    },
  })

  return updatedTicket
}

/**
 * Deletes a support ticket by ID for fundi users.
 * @param {string} id - The ID of the support ticket to delete.
 * @returns {Promise<Object>} Success message.
 * @throws {Error} If the ticket doesn't exist or ID is invalid.
 */
export const deleteFundiSupportTicket = async (id) => {
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
 * Gets support tickets for a specific fundi user.
 * @param {string} fundiId - The ID of the fundi user.
 * @returns {Promise<Array>} Array of support tickets for the fundi.
 */
export const getSupportTicketsByFundiUser = async (fundiId) => {
  if (!fundiId || typeof fundiId !== "string") {
    throw new Error("A valid fundi user ID is required")
  }

  const tickets = await prisma.supportTicket.findMany({
    where: { fundiId },
    include: {
      fundi: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          primary_skill: true,
          experience_level: true,
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
 * Assigns a support ticket to an admin for fundi tickets.
 * @param {string} ticketId - The ID of the support ticket.
 * @param {string} assignedToId - The ID of the admin to assign the ticket to.
 * @returns {Promise<Object>} The updated support ticket.
 * @throws {Error} If the ticket or admin is not found.
 */
export const assignFundiSupportTicket = async (ticketId, assignedToId) => {
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
      fundi: {
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          primary_skill: true,
          experience_level: true,
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
 * Gets support ticket statistics for fundi users in admin dashboard.
 * @returns {Promise<Object>} Statistics object with fundi ticket counts.
 */
export const getFundiSupportTicketStats = async () => {
  try {
    const [total, open, inProgress, resolved, closed, urgent] = await Promise.all([
      prisma.supportTicket.count({ where: { fundiId: { not: null } } }),
      prisma.supportTicket.count({ where: { status: "OPEN", fundiId: { not: null } } }),
      prisma.supportTicket.count({ where: { status: "IN_PROGRESS", fundiId: { not: null } } }),
      prisma.supportTicket.count({ where: { status: "RESOLVED", fundiId: { not: null } } }),
      prisma.supportTicket.count({ where: { status: "CLOSED", fundiId: { not: null } } }),
      prisma.supportTicket.count({ where: { priority: "URGENT", fundiId: { not: null } } }),
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
    console.error("Error fetching fundi support ticket stats:", error)
    throw new Error("Failed to fetch fundi support ticket statistics")
  }
}
