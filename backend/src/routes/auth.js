const express = require('express');
const {
  register,
  login,
  refreshToken,
  logout,
  getMe
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);

module.exports = router;