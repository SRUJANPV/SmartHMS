const { ActivityLog } = require('../models');

const activityLog = async (userId, action, description, req) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      description,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
  } catch (error) {
    console.error('Activity log error:', error);
  }
};

module.exports = { activityLog };