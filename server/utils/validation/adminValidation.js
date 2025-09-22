import Joi from "joi";

// Admin creation validation schema
export const createAdminSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 100 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^0[0-9]{9}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
      "any.required": "Phone number is required",
    }),

  role: Joi.string()
    .valid("SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT")
    .required()
    .messages({
      "any.only": "Role must be one of: SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT",
      "any.required": "Role is required",
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),

  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE").messages({
    "any.only": "Status must be either ACTIVE or INACTIVE",
  }),
});

// Admin update validation schema
export const updateAdminSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 100 characters",
  }),

  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email address",
  }),

  phone: Joi.string()
    .pattern(/^0[0-9]{9}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),

  role: Joi.string()
    .valid("SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT")
    .messages({
      "any.only": "Role must be one of: SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT",
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),

  status: Joi.string().valid("ACTIVE", "INACTIVE").messages({
    "any.only": "Status must be either ACTIVE or INACTIVE",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Admin login validation schema
export const adminLoginSchema = Joi.object({
  emailOrPhone: Joi.string().required().messages({
    "any.required": "Email or phone number is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
