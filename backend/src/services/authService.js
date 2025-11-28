const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, RefreshToken } = require('../models');

class AuthService {
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // If role is a string (role name), find the role ID
      let roleId = userData.roleId;
      if (!roleId && userData.role) {
        const role = await Role.findOne({ where: { name: userData.role } });
        if (!role) {
          throw new Error(`Role '${userData.role}' does not exist`);
        }
        roleId = role.id;
      }

      if (!roleId) {
        // Default to Patient role
        const patientRole = await Role.findOne({ where: { name: 'Patient' } });
        roleId = patientRole.id;
      }

      // Create user (model hook will hash password automatically)
      const user = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,  // Don't hash - model hook will do it
        phone: userData.phone,
        roleId
      });

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      // Store refresh token
      await RefreshToken.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      // Get user with role
      const userWithRole = await User.findByPk(user.id, {
        include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
        attributes: { exclude: ['password'] }
      });

      return {
        user: userWithRole,
        ...tokens
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async loginUser(email, password) {
    try {
      // Find user with role
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }]
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact administrator.');
      }

      // Verify password using model method
      const isPasswordValid = await user.correctPassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      // Store refresh token
      await RefreshToken.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      return {
        user: userResponse,
        ...tokens
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async refreshAuthToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Check if refresh token exists in database
      const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      // Get user with role
      const user = await User.findByPk(decoded.id, {
        include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
        attributes: { exclude: ['password'] }
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id);

      // Delete old refresh token and store new one
      await RefreshToken.destroy({ where: { token: refreshToken } });
      await RefreshToken.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      return {
        user,
        ...tokens
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  async logoutUser(refreshToken, userId) {
    try {
      if (refreshToken) {
        await RefreshToken.destroy({ where: { token: refreshToken } });
      }
      // Delete all expired tokens for this user
      await RefreshToken.destroy({
        where: {
          userId,
          expiresAt: { [require('sequelize').Op.lt]: new Date() }
        }
      });
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Get profile failed: ${error.message}`);
    }
  }

  generateTokens(userId) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });

    return { token, refreshToken };
  }
}


module.exports = new AuthService();