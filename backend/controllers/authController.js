const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');

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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password.' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, 'dung0804');
    res.json({ token, id: user._id, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
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