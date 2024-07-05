const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/doctor');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAppointment = async (req, res) => {
  const { userId, doctorId, date, time, status, note } = req.body;

  const newAppointment = new Appointment({
    userId,
    doctorId,
    date,
    time,
    status,
    note
  });

  try {
    const savedAppointment = await newAppointment.save();

    // Cập nhật mảng appointments của user
    await User.findByIdAndUpdate(userId, {
      $push: { appointments: savedAppointment._id }
    });

    // Cập nhật mảng appointments của doctor
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { appointments: savedAppointment._id }
    });

    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
