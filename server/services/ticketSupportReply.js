import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Creates a new support reply.
 * @param {Object} replyData - The reply data containing ticketId, message, authorType, and authorName.
 * @param {string} replyData.ticketId - The ID of the support ticket.
 * @param {string} replyData.message - The reply message content.
 * @param {string} replyData.authorType - The type of author (e.g., "ADMIN", "CLIENT", "FUNDI").
 * @param {string} replyData.authorName - The display name of the author.
 * @returns {Promise<Object>} The newly created support reply with ticket details.
 * @throws {Error} If the ticket doesn't exist or creation fails.
 */
export const createSupportReply = async (replyData) => {
  const { ticketId, message, authorType, authorName } = replyData;

  // Verify that the ticket exists
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Support ticket not found.");
  }

  // Create the reply
  const newReply = await prisma.supportReply.create({
    data: {
      ticketId,
      message,
      authorType,
      authorName,
    },
    include: {
      ticket: {
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
      },
    },
  });

  return newReply;
};

/**
 * Retrieves all replies for a specific support ticket.
 * @param {string} ticketId - The ID of the support ticket.
 * @returns {Promise<Array>} Array of support replies for the ticket.
 * @throws {Error} If the ticket doesn't exist.
 */
export const getRepliesByTicketId = async (ticketId) => {
  if (!ticketId || typeof ticketId !== "string") {
    throw new Error("A valid ticket ID is required");
  }

  // Verify ticket exists
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Support ticket not found");
  }

  const replies = await prisma.supportReply.findMany({
    where: { ticketId },
    orderBy: { createdAt: "asc" },
  });

  return replies;
};