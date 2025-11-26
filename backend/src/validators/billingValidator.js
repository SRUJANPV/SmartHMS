const Joi = require('joi');

const createBillSchema = Joi.object({
  patientId: Joi.string().uuid().required().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
    'any.required': 'Patient ID is required'
  }),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().min(1).max(200).required().messages({
        'string.min': 'Description cannot be empty',
        'string.max': 'Description cannot exceed 200 characters',
        'any.required': 'Description is required'
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required'
      }),
      unitPrice: Joi.number().min(0).required().messages({
        'number.min': 'Unit price cannot be negative',
        'any.required': 'Unit price is required'
      })
    })
  ).min(1).required().messages({
    'array.min': 'At least one item is required',
    'any.required': 'Items are required'
  }),
  notes: Joi.string().max(500).optional(),
  dueDate: Joi.date().min('now').optional().messages({
    'date.min': 'Due date cannot be in the past'
  })
});

const updateBillSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().optional(),
      description: Joi.string().min(1).max(200).required(),
      quantity: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().min(0).required()
    })
  ).optional(),
  notes: Joi.string().max(500).optional(),
  dueDate: Joi.date().min('now').optional(),
  status: Joi.string().valid('generated', 'sent', 'paid', 'cancelled').optional()
});

const billItemSchema = Joi.object({
  description: Joi.string().min(1).max(200).required().messages({
    'string.min': 'Description cannot be empty',
    'string.max': 'Description cannot exceed 200 characters',
    'any.required': 'Description is required'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required'
  }),
  unitPrice: Joi.number().min(0).required().messages({
    'number.min': 'Unit price cannot be negative',
    'any.required': 'Unit price is required'
  })
});

const billStatusSchema = Joi.object({
  status: Joi.string().valid('generated', 'sent', 'paid', 'cancelled').required().messages({
    'any.only': 'Status must be one of: generated, sent, paid, cancelled',
    'any.required': 'Status is required'
  })
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }

    next();
  };
};

module.exports = {
  createBillSchema: validate(createBillSchema),
  updateBillSchema: validate(updateBillSchema),
  billItemSchema: validate(billItemSchema),
  billStatusSchema: validate(billStatusSchema)
};