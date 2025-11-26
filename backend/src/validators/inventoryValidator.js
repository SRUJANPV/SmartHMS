const Joi = require('joi');

const createInventorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.min': 'Name cannot be empty',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  description: Joi.string().max(500).optional(),
  category: Joi.string().max(50).optional(),
  quantity: Joi.number().integer().min(0).required().messages({
    'number.min': 'Quantity cannot be negative',
    'any.required': 'Quantity is required'
  }),
  minStockLevel: Joi.number().integer().min(0).required().messages({
    'number.min': 'Minimum stock level cannot be negative',
    'any.required': 'Minimum stock level is required'
  }),
  unitPrice: Joi.number().min(0).required().messages({
    'number.min': 'Unit price cannot be negative',
    'any.required': 'Unit price is required'
  }),
  expiryDate: Joi.date().optional(),
  supplier: Joi.string().max(100).optional()
});

const updateInventorySchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  description: Joi.string().max(500).optional(),
  category: Joi.string().max(50).optional(),
  minStockLevel: Joi.number().integer().min(0).optional(),
  unitPrice: Joi.number().min(0).optional(),
  expiryDate: Joi.date().optional(),
  supplier: Joi.string().max(100).optional()
});

const updateStockSchema = Joi.object({
  quantityChange: Joi.number().integer().required().messages({
    'any.required': 'Quantity change is required'
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
  createInventorySchema: validate(createInventorySchema),
  updateInventorySchema: validate(updateInventorySchema),
  updateStockSchema: validate(updateStockSchema)
};