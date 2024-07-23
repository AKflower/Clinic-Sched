const Department = require('../models/department');

exports.addDepartment = async (req, res) => {
  const { name, description } = req.body;
  const newDepartment = new Department({ name, description });

  try {
    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  const { name, description } = req.body;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, {
      name, description
    }, { new: true });
    res.status(200).json(updatedDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Department deleted successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    
    const department = await Department.findById(req.params.id);
    res.status(200).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateDepartmentIsActive = async (req, res) => {
  const { isActive } = req.body;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    res.status(200).json(updatedDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
