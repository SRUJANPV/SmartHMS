const { RefreshToken } = require('../models');

class RefreshTokenRepository {
  async create(tokenData) {
    return await RefreshToken.create(tokenData);
  }

  async findByToken(token) {
    return await RefreshToken.findOne({ 
      where: { token },
      include: [{
        model: 'User',
        as: 'user'
      }]
    });
  }

  async deleteByToken(token) {
    return await RefreshToken.destroy({ where: { token } });
  }

  async deleteExpiredTokens(userId) {
    return await RefreshToken.destroy({
      where: {
        userId,
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });
  }

  async deleteAllForUser(userId) {
    return await RefreshToken.destroy({ where: { userId } });
  }
}

module.exports = new RefreshTokenRepository();