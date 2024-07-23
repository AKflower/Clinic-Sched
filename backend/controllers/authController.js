const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');
const crypto = require('crypto');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/sendEmail');

// Đăng ký tài khoản
exports.register = async (req, res) => {
  const { name, phone, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, phone, email, password: hashedPassword, role: 'user' });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await Doctor.findOne({ phone });
    }

    if (!user) {
      user = await Admin.findOne({ phone });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid phone or password.' });
    }

    if (user.role != 'admin' && !user.isActive) return res.status(400).json({ message: 'Account is not active.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password.' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, 'ngoc3105');
    res.json({ token, id: user._id, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { phone, currentPassword, newPassword } = req.body;

  try {
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await Doctor.findOne({ phone });
    }

    if (!user) {
      user = await Admin.findOne({ phone });
    }
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid current password.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { phone } = req.body;

  try {
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await Doctor.findOne({ phone });
    }

    if (!user) {
      user = await Admin.findOne({ phone });
    }


    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Tạo OTP
    const otp = crypto.randomBytes(3).toString('hex');
    const otpEntry = new OTP({ userId: user._id, otp });
    await otpEntry.save();

    // Gửi OTP qua email hoặc SMS
    await sendEmail(user.email, 'Password Reset OTP', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully.', user: user._id});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const otpEntry = await OTP.findOne({ userId, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { userId, otp, newPassword } = req.body;

  try {
    const otpEntry = await OTP.findOne({ userId, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    let user = await User.findById(userId);
    
    if (!user) {
      user = await Doctor.findById(userId);
    }

    if (!user) {
      user = await Admin.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await OTP.deleteMany({ userId });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};