import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    "string.min": "Job title must be at least 5 characters.",
    "string.max": "Job title must be at most 200 characters.",
    "string.empty": "Job title cannot be empty.",
    "any.required": "Job title is required.",
  }),

  category: Joi.string()
    .valid(
      "Mason",
      "Carpenter",
      "Plumber",
      "Electrician",
      "Painter",
      "Roofer",
      "Tiler",
      "Welder",
      "Other"
    )
    .required()
    .messages({
      "any.only":
        "Category must be one of: Mason, Carpenter, Plumber, Electrician, Painter, Roofer, Tiler, Welder, Other.",
      "any.required": "Category is required.",
    }),

  jobType: Joi.string()
    .valid("Full-time", "Part-time", "Contract", "One-time")
    .required()
    .messages({
      "any.only":
        "Job type must be one of: Full-time, Part-time, Contract, One-time.",
      "any.required": "Job type is required.",
    }),

  location: Joi.string().min(2).max(100).required().messages({
    "string.min": "Location must be at least 2 characters.",
    "string.max": "Location must be at most 100 characters.",
    "string.empty": "Location cannot be empty.",
    "any.required": "Location is required.",
  }),

  duration: Joi.string().min(1).max(50).required().messages({
    "string.min": "Duration must be at least 1 character.",
    "string.max": "Duration must be at most 50 characters.",
    "string.empty": "Duration cannot be empty.",
    "any.required": "Duration is required.",
  }),

  salary: Joi.string().min(1).max(100).required().messages({
    "string.min": "Salary must be at least 1 character.",
    "string.max": "Salary must be at most 100 characters.",
    "string.empty": "Salary cannot be empty.",
    "any.required": "Salary is required.",
  }),

  description: Joi.string().min(20).max(2000).required().messages({
    "string.min": "Job description must be at least 20 characters.",
    "string.max": "Job description must be at most 2000 characters.",
    "string.empty": "Job description cannot be empty.",
    "any.required": "Job description is required.",
  }),

  requirements: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Requirements must be at least 10 characters.",
    "string.max": "Requirements must be at most 1000 characters.",
    "string.empty": "Requirements cannot be empty.",
    "any.required": "Requirements are required.",
  }),

  responsibilities: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Responsibilities must be at least 10 characters.",
    "string.max": "Responsibilities must be at most 1000 characters.",
    "string.empty": "Responsibilities cannot be empty.",
    "any.required": "Responsibilities are required.",
  }),

  benefits: Joi.string().max(1000).optional().allow("").messages({
    "string.max": "Benefits must be at most 1000 characters.",
  }),

  company: Joi.string().min(2).max(100).required().messages({
    "string.min": "Company name must be at least 2 characters.",
    "string.max": "Company name must be at most 100 characters.",
    "string.empty": "Company name cannot be empty.",
    "any.required": "Company name is required.",
  }),

  contactPerson: Joi.string().min(2).max(100).required().messages({
    "string.min": "Contact person must be at least 2 characters.",
    "string.max": "Contact person must be at most 100 characters.",
    "string.empty": "Contact person cannot be empty.",
    "any.required": "Contact person is required.",
  }),

  phone: Joi.string()
    .pattern(/^\+?[\d\s\-$$$$]{10,20}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid format.",
      "string.empty": "Phone number cannot be empty.",
      "any.required": "Phone number is required.",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email is required.",
  }),

  preferredContact: Joi.string()
    .valid("phone", "email", "both")
    .required()
    .messages({
      "any.only": "Preferred contact must be one of: phone, email, both.",
      "any.required": "Preferred contact method is required.",
    }),

  isUrgent: Joi.boolean().optional().default(false),
  isPaid: Joi.boolean().optional().default(false),
});

export const updateJobSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  category: Joi.string()
    .valid(
      "Mason",
      "Carpenter",
      "Plumber",
      "Electrician",
      "Painter",
      "Roofer",
      "Tiler",
      "Welder",
      "Other"
    )
    .optional(),
  jobType: Joi.string()
    .valid("Full-time", "Part-time", "Contract", "One-time")
    .optional(),
  location: Joi.string().min(2).max(100).optional(),
  duration: Joi.string().min(1).max(50).optional(),
  salary: Joi.string().min(1).max(100).optional(),
  description: Joi.string().min(20).max(2000).optional(),
  requirements: Joi.string().min(10).max(1000).optional(),
  responsibilities: Joi.string().min(10).max(1000).optional(),
  benefits: Joi.string().max(1000).optional().allow(""),
  company: Joi.string().min(2).max(100).optional(),
  contactPerson: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-$$$$]{10,20}$/)
    .optional(),
  email: Joi.string().email().optional(),
  preferredContact: Joi.string().valid("phone", "email", "both").optional(),
  isUrgent: Joi.boolean().optional(),
  status: Joi.string()
    .valid("PENDING", "ACTIVE", "CLOSED", "EXPIRED")
    .optional(),
});

export const updateJobStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "ACTIVE", "CLOSED", "EXPIRED")
    .required()
    .messages({
      "any.only": "Status must be one of: PENDING, ACTIVE, CLOSED, EXPIRED.",
      "any.required": "Status is required.",
    }),
});

export const updateAdminJobSchema = Joi.object({
  // Job details
  title: Joi.string().min(5).max(200).optional().messages({
    "string.min": "Job title must be at least 5 characters.",
    "string.max": "Job title must be at most 200 characters.",
  }),

  category: Joi.string()
    .valid(
      "Mason",
      "Carpenter",
      "Plumber",
      "Electrician",
      "Painter",
      "Roofer",
      "Tiler",
      "Welder",
      "Other"
    )
    .optional()
    .messages({
      "any.only":
        "Category must be one of: Mason, Carpenter, Plumber, Electrician, Painter, Roofer, Tiler, Welder, Other.",
    }),

  jobType: Joi.string()
    .valid("Full-time", "Part-time", "Contract", "One-time")
    .optional()
    .messages({
      "any.only":
        "Job type must be one of: Full-time, Part-time, Contract, One-time.",
    }),

  location: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Location must be at least 2 characters.",
    "string.max": "Location must be at most 100 characters.",
  }),

  duration: Joi.string().min(1).max(50).optional().messages({
    "string.min": "Duration must be at least 1 character.",
    "string.max": "Duration must be at most 50 characters.",
  }),

  salary: Joi.string().min(1).max(100).optional().messages({
    "string.min": "Salary must be at least 1 character.",
    "string.max": "Salary must be at most 100 characters.",
  }),

  // Description fields - match your database schema
  Jobdescription: Joi.string().min(20).max(2000).optional().messages({
    "string.min": "Job description must be at least 20 characters.",
    "string.max": "Job description must be at most 2000 characters.",
  }),

  SkillsAndrequirements: Joi.string().min(10).max(1000).optional().messages({
    "string.min": "Skills and requirements must be at least 10 characters.",
    "string.max": "Skills and requirements must be at most 1000 characters.",
  }),

  responsibilities: Joi.string().min(10).max(1000).optional().messages({
    "string.min": "Responsibilities must be at least 10 characters.",
    "string.max": "Responsibilities must be at most 1000 characters.",
  }),

  benefits: Joi.string().max(1000).optional().allow("", null).messages({
    "string.max": "Benefits must be at most 1000 characters.",
  }),

  // Company details - match your database schema
  companyName: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Company name must be at least 2 characters.",
    "string.max": "Company name must be at most 100 characters.",
  }),

  contactPerson: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Contact person must be at least 2 characters.",
    "string.max": "Contact person must be at most 100 characters.",
  }),

  phoneNumber: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]{10,20}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be a valid format.",
    }),

  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address.",
  }),

  preferredContact: Joi.string()
    .valid("phone", "email", "both")
    .optional()
    .messages({
      "any.only": "Preferred contact must be one of: phone, email, both.",
    }),

  // Status and flags
  isUrgent: Joi.boolean().optional(),
  isPaid: Joi.boolean().optional(),
  status: Joi.string()
    .valid("PENDING", "ACTIVE", "CLOSED", "REJECTED", "EXPIRED")
    .optional()
    .messages({
      "any.only":
        "Status must be one of: PENDING, ACTIVE, CLOSED, REJECTED, EXPIRED.",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
  });

// Schema for creating jobs as admin
export const createAdminJobSchema = Joi.object({
  // Job details
  title: Joi.string().min(5).max(200).required().messages({
    "string.min": "Job title must be at least 5 characters.",
    "string.max": "Job title must be at most 200 characters.",
    "string.empty": "Job title cannot be empty.",
    "any.required": "Job title is required.",
  }),

  category: Joi.string()
    .valid("Mason", "Carpenter", "Plumber", "Electrician", "Painter", "Roofer", "Tiler", "Welder", "Other")
    .required()
    .messages({
      "any.only": "Category must be one of: Mason, Carpenter, Plumber, Electrician, Painter, Roofer, Tiler, Welder, Other.",
      "any.required": "Category is required.",
    }),

  jobType: Joi.string().valid("Full-time", "Part-time", "Contract", "One-time").required().messages({
    "any.only": "Job type must be one of: Full-time, Part-time, Contract, One-time.",
    "any.required": "Job type is required.",
  }),

  location: Joi.string().min(2).max(100).required().messages({
    "string.min": "Location must be at least 2 characters.",
    "string.max": "Location must be at most 100 characters.",
    "string.empty": "Location cannot be empty.",
    "any.required": "Location is required.",
  }),

  duration: Joi.string().min(1).max(50).required().messages({
    "string.min": "Duration must be at least 1 character.",
    "string.max": "Duration must be at most 50 characters.",
    "string.empty": "Duration cannot be empty.",
    "any.required": "Duration is required.",
  }),

  salary: Joi.string().min(1).max(100).required().messages({
    "string.min": "Salary must be at least 1 character.",
    "string.max": "Salary must be at most 100 characters.",
    "string.empty": "Salary cannot be empty.",
    "any.required": "Salary is required.",
  }),

  // Description fields
  Jobdescription: Joi.string().min(20).max(2000).required().messages({
    "string.min": "Job description must be at least 20 characters.",
    "string.max": "Job description must be at most 2000 characters.",
    "string.empty": "Job description cannot be empty.",
    "any.required": "Job description is required.",
  }),

  SkillsAndrequirements: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Skills and requirements must be at least 10 characters.",
    "string.max": "Skills and requirements must be at most 1000 characters.",
    "string.empty": "Skills and requirements cannot be empty.",
    "any.required": "Skills and requirements are required.",
  }),

  responsibilities: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Responsibilities must be at least 10 characters.",
    "string.max": "Responsibilities must be at most 1000 characters.",
    "string.empty": "Responsibilities cannot be empty.",
    "any.required": "Responsibilities are required.",
  }),

  benefits: Joi.string().max(1000).optional().allow("", null).messages({
    "string.max": "Benefits must be at most 1000 characters.",
  }),

  // Company details
  companyName: Joi.string().min(2).max(100).required().messages({
    "string.min": "Company name must be at least 2 characters.",
    "string.max": "Company name must be at most 100 characters.",
    "string.empty": "Company name cannot be empty.",
    "any.required": "Company name is required.",
  }),

  contactPerson: Joi.string().min(2).max(100).required().messages({
    "string.min": "Contact person must be at least 2 characters.",
    "string.max": "Contact person must be at most 100 characters.",
    "string.empty": "Contact person cannot be empty.",
    "any.required": "Contact person is required.",
  }),

  phoneNumber: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]{10,20}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid format.",
      "string.empty": "Phone number cannot be empty.",
      "any.required": "Phone number is required.",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email is required.",
  }),

  preferredContact: Joi.string().valid("phone", "email", "both").required().messages({
    "any.only": "Preferred contact must be one of: phone, email, both.",
    "any.required": "Preferred contact method is required.",
  }),

  // Client ownership - REQUIRED field
  clientUserId: Joi.string().required().messages({
    "string.empty": "Client User ID is required.",
    "any.required": "Client User ID is required to assign job ownership.",
  }),

  // Optional fields with defaults
  isUrgent: Joi.boolean().optional().default(false),
  isPaid: Joi.boolean().optional().default(false),
  status: Joi.string().valid("PENDING", "ACTIVE", "CLOSED", "REJECTED", "EXPIRED").optional().default("ACTIVE"),
});