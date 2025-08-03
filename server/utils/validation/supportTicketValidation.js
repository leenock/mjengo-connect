import Joi from "joi"

export const createSupportTicketSchema = Joi.object({
  category: Joi.string()
    .valid("PAYMENT_ISSUES", "ACCOUNT_VERIFICATION", "HARASSMENT_REPORT", "GENERAL_INQUIRY", "OTHER")
    .required()
    .messages({
      "any.only":
        "Category must be one of: PAYMENT_ISSUES, ACCOUNT_VERIFICATION, HARASSMENT_REPORT, GENERAL_INQUIRY, OTHER",
      "any.required": "Category is required.",
    }),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").required().messages({
    "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT", // Updated message to reflect uppercase
    "any.required": "Priority is required.",
  }),
  subject: Joi.string().min(5).max(200).required().messages({
    "string.min": "Subject must be at least 5 characters.",
    "string.max": "Subject must be at most 200 characters.",
    "string.empty": "Subject cannot be empty.",
    "any.required": "Subject is required.",
  }),
  message: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Message must be at least 10 characters.",
    "string.max": "Message must be at most 1000 characters.",
    "string.empty": "Message cannot be empty.",
    "any.required": "Message is required.",
  }),
  clientId: Joi.string().required().messages({
    // Changed from clientUserId to clientId
    "string.empty": "Client ID cannot be empty.",
    "any.required": "Client ID is required.",
  }),
})

export const updateSupportTicketSchema = Joi.object({
  status: Joi.string().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED").optional().messages({
    "any.only": "Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED",
  }),
  adminResponse: Joi.string().max(1000).optional().messages({
    "string.max": "Admin response must be at most 1000 characters.",
  }),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").optional().messages({
    // Updated to uppercase enum values
    "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT", // Updated message to reflect uppercase
  }),
})
