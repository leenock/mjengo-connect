import Joi from "joi"

/**
 * Validation schema for creating a fundi support ticket
 */
export const createFundiSupportTicketSchema = Joi.object({
  fundiId: Joi.string().required().messages({
    "string.empty": "Fundi ID is required",
    "any.required": "Fundi ID is required",
  }),
  subject: Joi.string().min(5).max(200).required().messages({
    "string.empty": "Subject is required",
    "string.min": "Subject must be at least 5 characters long",
    "string.max": "Subject cannot exceed 200 characters",
    "any.required": "Subject is required",
  }),
  message: Joi.string().min(10).max(2000).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message must be at least 10 characters long",
    "string.max": "Message cannot exceed 2000 characters",
    "any.required": "Message is required",
  }),
  category: Joi.string()
    .valid("PAYMENT_ISSUES", "ACCOUNT_VERIFICATION", "HARASSMENT_REPORT", "GENERAL_INQUIRY", "OTHER")
    .required()
    .messages({
      "any.only":
        "Category must be one of: PAYMENT_ISSUES, ACCOUNT_VERIFICATION, HARASSMENT_REPORT, GENERAL_INQUIRY, OTHER",
      "any.required": "Category is required",
    }),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").required().messages({
    "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT",
    "any.required": "Priority is required",
  }),
})

/**
 * Validation schema for updating a fundi support ticket
 */
export const updateFundiSupportTicketSchema = Joi.object({
  subject: Joi.string().min(5).max(200).optional().messages({
    "string.min": "Subject must be at least 5 characters long",
    "string.max": "Subject cannot exceed 200 characters",
  }),
  message: Joi.string().min(10).max(2000).optional().messages({
    "string.min": "Message must be at least 10 characters long",
    "string.max": "Message cannot exceed 2000 characters",
  }),
  category: Joi.string()
    .valid("PAYMENT_ISSUES", "ACCOUNT_VERIFICATION", "HARASSMENT_REPORT", "GENERAL_INQUIRY", "OTHER")
    .optional()
    .messages({
      "any.only":
        "Category must be one of: PAYMENT_ISSUES, ACCOUNT_VERIFICATION, HARASSMENT_REPORT, GENERAL_INQUIRY, OTHER",
    }),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").optional().messages({
    "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT",
  }),
  status: Joi.string().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED").optional().messages({
    "any.only": "Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED",
  }),
})
