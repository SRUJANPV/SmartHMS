const Joi = require('joi');

const createPatientSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s-()]{10,}$/).required().messages({
    'string.pattern.base': 'Please provide a valid phone number',
    'any.required': 'Phone number is required'
  }),
  dateOfBirth: Joi.date().max('now').required().messages({
    'date.max': 'Date of birth cannot be in the future',
    'any.required': 'Date of birth is required'
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
    'any.only': 'Gender must be Male, Female, or Other',
    'any.required': 'Gender is required'
  }),
  address: Joi.string().max(500).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phone: Joi.string().required()
  }).optional(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  medicalHistory: Joi.string().max(1000).optional(),
  insuranceInfo: Joi.object({
    provider: Joi.string().required(),
    policyNumber: Joi.string().required(),
    groupNumber: Joi.string().optional(),
    validUntil: Joi.date().optional()
  }).optional()
});

const updatePatientSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s-()]{10,}$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  dateOfBirth: Joi.date().max('now').optional().messages({
    'date.max': 'Date of birth cannot be in the future'
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
  address: Joi.string().max(500).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phone: Joi.string().required()
  }).optional(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  medicalHistory: Joi.string().max(1000).optional(),
  insuranceInfo: Joi.object({
    provider: Joi.string().required(),
    policyNumber: Joi.string().required(),
    groupNumber: Joi.string().optional(),
    validUntil: Joi.date().optional()
  }).optional(),
  isActive: Joi.boolean().optional()
});

const documentUploadSchema = Joi.object({
  documentType: Joi.string().max(100).required().messages({
    'any.required': 'Document type is required'
  }),
  description: Joi.string().max(500).optional()
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
  createPatientSchema: validate(createPatientSchema),
  updatePatientSchema: validate(updatePatientSchema),
  documentUploadSchema: validate(documentUploadSchema)
};