const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAdmin = async (req, res) => {
  const { name, phone, email, password, gender, birth } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ name, phone, email, password: hashedPassword, gender, birth });

  try {
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  const { name, phone, email, password, birth } = req.body;
  const updateData = { name, phone, email, birth };
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Admin deleted successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};