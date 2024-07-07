const File = require('../models/file');

exports.addFile = async (req, res) => {
  const { userId, name, gender, birthDate, symptom, description } = req.body;
  const createdDate = new Date();
  const newFile = new File({ userId, name, gender, birthDate,  symptom, description, createdDate, status: 0 });

  try {
    const savedFile = await newFile.save();
    res.status(201).json(savedFile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateFile = async (req, res) => {
  const { symptom, description, date, status, result } = req.body;

  try {
    const updatedFile = await File.findByIdAndUpdate(req.params.id, { symptom, description, date, status, result }, { new: true });
    res.status(200).json(updatedFile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
