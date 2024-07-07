const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authenticateToken, authController.changePassword);
// Route để yêu cầu đặt lại mật khẩu
router.post('/forgot-password', authController.forgotPassword);

// Route để xác thực OTP
router.post('/verify-otp', authController.verifyOTP);

// Route để đặt lại mật khẩu
router.post('/reset-password', authController.resetPassword);

module.exports = router;
