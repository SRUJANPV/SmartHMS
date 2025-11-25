const authService = require('../services/authService');
const logger = require('../utils/logger');
const { activityLog } = require('../utils/activityLog');

exports.register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    
    await activityLog(
      result.user.id,
      'USER_REGISTER',
      `User ${result.user.firstName} ${result.user.lastName} registered with role ${result.user.role.name}`,
      req
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    
    await activityLog(
      result.user.id,
      'USER_LOGIN',
      `User ${result.user.firstName} ${result.user.lastName} logged in`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAuthToken(refreshToken);
    
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.logoutUser(refreshToken, req.user.id);
    
    await activityLog(
      req.user.id,
      'USER_LOGOUT',
      `User ${req.user.firstName} ${req.user.lastName} logged out`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changeUserPassword(req.user.id, currentPassword, newPassword);
    
    await activityLog(
      req.user.id,
      'PASSWORD_CHANGE',
      'User changed password successfully',
      req
    );

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};