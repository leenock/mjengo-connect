import Joi from "joi"

// Validation schema for saving a job
export const saveJobSchema = Joi.object({
  jobId: Joi.string().required().messages({
    "string.empty": "Job ID is required",
    "any.required": "Job ID is required",
  }),
})

// Validation schema for getting saved jobs with pagination
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
})

// Validation schema for a job ID parameter
export const jobIdParamSchema = Joi.object({
  jobId: Joi.string().required().messages({
    "string.empty": "Job ID is required",
    "any.required": "Job ID is required",
  }),
})