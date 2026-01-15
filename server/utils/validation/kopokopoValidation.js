import Joi from 'joi';

/**
 * Validation schema for initiating KopoKopo STK Push payment
 */
export const initiateKopokopoStkPushSchema = Joi.object({
  paymentChannel: Joi.string().valid("M-PESA STK Push").default("M-PESA STK Push").messages({
    'any.only': 'Payment channel must be "M-PESA STK Push"'
  }),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required'
  }),
  currency: Joi.string().valid("KES").default("KES").messages({
    'any.only': 'Currency must be "KES"'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must be at most 50 characters',
    'string.empty': 'First name cannot be empty',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must be at most 50 characters',
    'string.empty': 'Last name cannot be empty',
    'any.required': 'Last name is required'
  }),
  phoneNumber: Joi.string().pattern(/^\+?\d{10,15}$/).required().messages({
    'string.pattern.base': 'Phone number must be a valid number (10-15 digits, optionally starting with +)',
    'string.empty': 'Phone number cannot be empty',
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().optional().allow('', null).messages({
    'string.email': 'Email must be a valid email address'
  }),
  metadata: Joi.object({
    customerId: Joi.string().optional(),
    reference: Joi.string().optional(),
    notes: Joi.string().optional()
  }).optional()
});

/**
 * Validation schema for webhook callback from KopoKopo
 */
export const kopokopoWebhookSchema = Joi.object({
  data: Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid("incoming_payment").required(),
    attributes: Joi.object({
      initiation_time: Joi.string().optional(),
      status: Joi.string().valid("Success", "Failed").required(),
      event: Joi.object({
        type: Joi.string().optional(),
        resource: Joi.object({
          id: Joi.string().optional(),
          reference: Joi.string().optional(),
          origination_time: Joi.string().optional(),
          sender_phone_number: Joi.string().optional(),
          amount: Joi.string().optional(),
          currency: Joi.string().optional(),
          till_number: Joi.string().optional(),
          system: Joi.string().optional(),
          status: Joi.string().optional(),
          sender_first_name: Joi.string().optional(),
          sender_middle_name: Joi.string().optional().allow(null),
          sender_last_name: Joi.string().optional()
        }).optional().allow(null),
        errors: Joi.alternatives().try(
          Joi.string(),
          Joi.array(),
          Joi.object()
        ).optional().allow(null)
      }).required(),
      metadata: Joi.object().optional(),
      _links: Joi.object({
        callback_url: Joi.string().optional(),
        self: Joi.string().optional()
      }).optional()
    }).required()
  }).required()
});
