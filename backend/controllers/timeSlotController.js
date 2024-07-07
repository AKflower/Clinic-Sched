const TimeSlot = require('../models/TimeSlot');

exports.createTimeSlot = async (req, res) => {
  const { name, time } = req.body;

  const newTimeSlot = new TimeSlot({ name, time });

  try {
    const savedTimeSlot = await newTimeSlot.save();
    res.status(201).json(savedTimeSlot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find();
    res.status(200).json(timeSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
