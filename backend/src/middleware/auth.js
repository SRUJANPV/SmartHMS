const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'permissions']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account is inactive.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role.name} is not authorized to access this route.`
      });
    }

    next();
  };
};

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userPermissions = req.user.role.permissions;
    
    if (!userPermissions.includes(permission) && !userPermissions.includes('all')) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${permission}`
      });
    }

    next();
  };
};

module.exports = { auth, authorize, hasPermission };