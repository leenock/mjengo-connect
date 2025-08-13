import Joi from "joi"

export const registerFundiUserSchema = Joi.object({
  email: Joi.string().email().optional().allow("").messages({
    "string.email": "Email must be a valid email address.",
  }),
  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must be a valid number between 10 to 15 digits.",
      "string.empty": "Phone cannot be empty.",
      "any.required": "Phone is required.",
    }),
  firstName: Joi.string().min(2).max(30).optional().allow("").messages({
    "string.min": "First name must be at least 2 characters.",
    "string.max": "First name must be at most 30 characters.",
  }),
  lastName: Joi.string().min(2).max(30).optional().allow("").messages({
    "string.min": "Last name must be at least 2 characters.",
    "string.max": "Last name must be at most 30 characters.",
  }),
  location: Joi.string().min(2).max(100).required().messages({
    "string.min": "Location must be at least 2 characters.",
    "string.max": "Location must be at most 100 characters.",
    "string.empty": "Location cannot be empty.",
    "any.required": "Location is required.",
  }),
  primary_skill: Joi.string().min(2).max(50).required().messages({
    "string.min": "Primary skill must be at least 2 characters.",
    "string.max": "Primary skill must be at most 50 characters.",
    "string.empty": "Primary skill cannot be empty.",
    "any.required": "Primary skill is required.",
  }),
  experience_level: Joi.string().valid("BEGINNER", "INTERMEDIATE", "EXPERIENCED", "EXPERT").required().messages({
    "any.only": "Experience level must be one of: BEGINNER, INTERMEDIATE, EXPERIENCED, EXPERT",
    "any.required": "Experience level is required.",
  }),
  biography: Joi.string().min(10).max(500).optional().allow("").messages({
    "string.min": "Biography must be at least 10 characters.",
    "string.max": "Biography must be at most 500 characters.",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password must be at most 100 characters.",
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
})

export const updateFundiUserSchema = Joi.object({
  email: Joi.string().email().optional().allow("").messages({
    "string.email": "Email must be a valid email address.",
  }),
  firstName: Joi.string().min(2).max(30).optional().allow("").messages({
    "string.min": "First name must be at least 2 characters.",
    "string.max": "First name must be at most 30 characters.",
  }),
  lastName: Joi.string().min(2).max(30).optional().allow("").messages({
    "string.min": "Last name must be at least 2 characters.",
    "string.max": "Last name must be at most 30 characters.",
  }),
  location: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Location must be at least 2 characters.",
    "string.max": "Location must be at most 100 characters.",
  }),
  primary_skill: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Primary skill must be at least 2 characters.",
    "string.max": "Primary skill must be at most 50 characters.",
  }),
  experience_level: Joi.string().valid("BEGINNER", "INTERMEDIATE", "EXPERIENCED", "EXPERT").optional().messages({
    "any.only": "Experience level must be one of: BEGINNER, INTERMEDIATE, EXPERIENCED, EXPERT",
  }),
  biography: Joi.string().min(10).max(500).optional().allow("").messages({
    "string.min": "Biography must be at least 10 characters.",
    "string.max": "Biography must be at most 500 characters.",
  }),
})

export const loginFundiUserSchema = Joi.object({
  emailOrPhone: Joi.string().required().messages({
    "string.empty": "Email or phone cannot be empty.",
    "any.required": "Email or phone is required.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
})
