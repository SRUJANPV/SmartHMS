const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { sequelize, testConnection, defineAssociations, Role } = require('./src/models');
const logger = require('./src/utils/logger');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/patients', require('./src/routes/patients'));
app.use('/api/appointments', require('./src/routes/appointments'));
app.use('/api/billing', require('./src/routes/billing'));
app.use('/api/inventory', require('./src/routes/inventory'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartCare HMS Backend is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const defaultRoles = [
  {
    name: 'Admin',
    description: 'System Administrator with full access',
    permissions: ['all']
  },
  {
    name: 'Doctor',
    description: 'Medical Doctor',
    permissions: [
      'view_patients',
      'manage_patients',
      'view_appointments',
      'manage_appointments',
      'view_medical_records',
      'manage_medical_records',
      'view_bills'
    ]
  },
  {
    name: 'Nurse',
    description: 'Nursing Staff',
    permissions: [
      'view_patients',
      'view_appointments',
      'manage_appointments',
      'view_medical_records',
      'manage_medical_records'
    ]
  },
  {
    name: 'Staff',
    description: 'Hospital Staff',
    permissions: [
      'view_patients',
      'manage_patients',
      'view_appointments',
      'manage_appointments',
      'view_bills',
      'manage_bills',
      'view_inventory'
    ]
  },
  {
    name: 'Patient',
    description: 'Patient',
    permissions: [
      'view_own_profile',
      'view_own_appointments',
      'view_own_bills'
    ]
  }
];

const ensureDefaultRoles = async () => {
  for (const roleData of defaultRoles) {
    await Role.findOrCreate({
      where: { name: roleData.name },
      defaults: roleData
    });
  }
};

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Define associations first
    defineAssociations();
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('✅ Database tables synced');
    
    // Ensure default roles exist
    await ensureDefaultRoles();
    console.log('✅ Default roles ensured');

    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 SmartCare HMS Backend Server Started');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📊 Database: ${process.env.DB_NAME}`);
      console.log('');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;