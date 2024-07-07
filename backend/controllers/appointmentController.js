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

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAppointment = async (req, res) => {
  const { userId, doctorId, fileId, date, timeId, status, note } = req.body;
  
  const newAppointment = new Appointment({ userId, doctorId, fileId, date, timeId, status, note });

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

exports.updateAppointment = async (req, res) => {
  const { date, time, status, note } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, {
      date, time, status, note
    }, { new: true });
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });

    await Appointment.findByIdAndDelete(req.params.id);

    // Xóa id cuộc hẹn khỏi user và doctor liên quan
    await User.findByIdAndUpdate(appointment.userId, {
      $pull: { appointments: req.params.id }
    });

    await Doctor.findByIdAndUpdate(appointment.doctorId, {
      $pull: { appointments: req.params.id }
    });

    res.status(200).json({ message: 'Appointment deleted successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getDoctorAppointmentsTimeByDate = async (req, res) => {
  
  const { doctorId } = req.params;
  const { date } = req.query;
  try {
    // Tìm tất cả các cuộc hẹn của bác sĩ trong ngày cụ thể
    const appointments = await Appointment.find({ doctorId, date });
    console.log(appointments)
    // Lấy ra các thời gian của cuộc hẹn
    const appointmentTimes = appointments.map(appointment => appointment.timeId);

    res.status(200).json(appointmentTimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorAppointmentsByDate = async (req, res) => {
  
  const { doctorId } = req.params;
  const { date } = req.query;
  console.log(doctorId,date);
  try {
    // Tìm tất cả các cuộc hẹn của bác sĩ trong ngày cụ thể
    const appointments = await Appointment.find({ doctorId, date });

    res.status(200).json(appointments).populate('name','phone', 'email', 'gender', 'department', 'appointments');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAppointmentsByDate = async (req, res) => {
  
  const { userId } = req.params;
  const { date } = req.query;
  try {
    // Tìm tất cả các cuộc hẹn của bác sĩ trong ngày cụ thể
    const appointments = await Appointment.find({ userId, date }).populate('name','phone', 'email', 'gender', 'department', 'appointments');;

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};