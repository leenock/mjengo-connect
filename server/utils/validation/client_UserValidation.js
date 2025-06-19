import Joi from 'joi';

export const registerClientUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is required.'
  }),
  phone: Joi.string().pattern(/^\d{10,15}$/).required().messages({
    'string.pattern.base': 'Phone must be a valid number between 10 to 15 digits.',
    'string.empty': 'Phone cannot be empty.',
    'any.required': 'Phone is required.'
  }),
  firstName: Joi.string().min(2).max(30).required().messages({
    'string.min': 'First name must be at least 2 characters.',
    'string.max': 'First name must be at most 30 characters.',
    'string.empty': 'First name cannot be empty.',
    'any.required': 'First name is required.'
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    'string.min': 'Last name must be at least 2 characters.',
    'string.max': 'Last name must be at most 30 characters.',
    'string.empty': 'Last name cannot be empty.',
    'any.required': 'Last name is required.'
  }),
 company: Joi.string().min(2).max(100).optional().allow('').messages({
  'string.min': 'Company name must be at least 2 characters.',
  'string.max': 'Company name must be at most 100 characters.',
}),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'Password must be at least 6 characters.',
    'string.max': 'Password must be at most 100 characters.',
    'string.empty': 'Password cannot be empty.',
    'any.required': 'Password is required.'
  }),
  location: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Location must be at least 2 characters.',
    'string.max': 'Location must be at most 100 characters.',
    'string.empty': 'Location cannot be empty.',
    'any.required': 'Location is required.'
  })
});
