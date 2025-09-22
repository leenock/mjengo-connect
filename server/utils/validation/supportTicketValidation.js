import Joi from "joi"

// Support ticket creation validation schema
export const createSupportTicketSchema = Joi.object({
  subject: Joi.string().min(5).max(200).required().messages({
    "string.min": "Subject must be at least 5 characters long",
    "string.max": "Subject cannot exceed 200 characters",
    "any.required": "Subject is required",
  }),

  message: Joi.string().min(10).max(2000).required().messages({
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

  clientId: Joi.string().required().messages({
    "any.required": "Client ID is required",
  }),
})

// Support ticket update validation schema
export const updateSupportTicketSchema = Joi.object({
  subject: Joi.string().min(5).max(200).messages({
    "string.min": "Subject must be at least 5 characters long",
    "string.max": "Subject cannot exceed 200 characters",
  }),

  message: Joi.string().min(10).max(2000).messages({
    "string.min": "Message must be at least 10 characters long",
    "string.max": "Message cannot exceed 2000 characters",
  }),

  category: Joi.string()
    .valid("PAYMENT_ISSUES", "ACCOUNT_VERIFICATION", "HARASSMENT_REPORT", "GENERAL_INQUIRY", "OTHER")
    .messages({
      "any.only":
        "Category must be one of: PAYMENT_ISSUES, ACCOUNT_VERIFICATION, HARASSMENT_REPORT, GENERAL_INQUIRY, OTHER",
    }),

  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").messages({
    "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT",
  }),

  status: Joi.string().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED").messages({
    "any.only": "Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED",
  }),

  assignedToId: Joi.string().messages({
    "string.base": "Assigned admin ID must be a string",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  })
