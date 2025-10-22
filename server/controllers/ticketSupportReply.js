import { createSupportReply, getRepliesByTicketId } from "../services/ticketSupportReply.js";

/**
 * Creates a new support reply.
 * @route POST /api/admin/support/tickets/:id/reply
 * @access Admin only
 */
export const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const admin = req.admin; // Assuming you attach admin to req in auth middleware

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required and must be a non-empty string" });
    }

    // Validate admin exists (from auth middleware)
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const replyData = {
      ticketId: id,
      message: message.trim(),
      authorType: "ADMIN",
      authorName: `${admin.fullName} (${admin.role.replace('_', ' ')})`

    };

    const newReply = await createSupportReply(replyData);

    return res.status(201).json({
      message: "Reply created successfully",
      reply: newReply,
    });
  } catch (error) {
    console.error("Create reply error:", error);
    return res.status(500).json({ message: error.message || "Failed to create reply" });
  }
};

/**
 * Gets all replies for a support ticket.
 * @route GET /api/admin/support/tickets/:id/replies
 * @access Admin only
 */
export const getReplies = async (req, res) => {
  try {
    const { id } = req.params;

    const replies = await getRepliesByTicketId(id);

    return res.status(200).json({
      replies,
    });
  } catch (error) {
    console.error("Get replies error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch replies" });
  }
};