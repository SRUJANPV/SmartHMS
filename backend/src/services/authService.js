const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const { Role } = require('../models');
const { generatePatientId } = require('../utils/helpers');

class AuthService {
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
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
        throw new Error('Role is required');
      }

      // Prepare user data without the role field
      const createData = {
        ...userData,
        roleId,
        role: undefined // Remove the role field
      };

      // Create user
      const user = await userRepository.create(createData);

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      // Store refresh token
      await refreshTokenRepository.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      const userWithRole = await userRepository.findByIdWithRole(user.id);

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
      const user = await userRepository.findByEmailWithRole(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact administrator.');
      }

      // Verify password
      const isPasswordValid = await user.correctPassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await userRepository.update(user.id, { lastLogin: new Date() });

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      // Store refresh token
      await refreshTokenRepository.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Remove password from response
      user.password = undefined;

      return {
        user,
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
      const storedToken = await refreshTokenRepository.findByToken(refreshToken);
      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      // Get user
      const user = await userRepository.findByIdWithRole(decoded.id);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id);

      // Delete old refresh token and store new one
      await refreshTokenRepository.deleteByToken(refreshToken);
      await refreshTokenRepository.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Remove password from response
      user.password = undefined;

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
        await refreshTokenRepository.deleteByToken(refreshToken);
      }
      
      // Also delete all expired tokens for this user
      await refreshTokenRepository.deleteExpiredTokens(userId);
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await userRepository.findByIdWithRole(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.password = undefined;
      return user;
    } catch (error) {
      throw new Error(`Profile fetch failed: ${error.message}`);
    }
  }

  async changeUserPassword(userId, currentPassword, newPassword) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.correctPassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await userRepository.update(userId, { password: newPassword });

      return true;
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  generateTokens(userId) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    });

    return { token, refreshToken };
  }
}

module.exports = new AuthService();