const Appointment = require('../models/Appointment');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const mongoose = require('mongoose');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('fileId').populate('userId').populate('doctorId').populate('departmentId');;
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
  const { userId, doctorId, fileId, date, timeId, status, note, departmentId } = req.body;
  
  const newAppointment = new Appointment({ userId, doctorId, fileId, date, timeId, status, note, departmentId });

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
    const appointments = await Appointment.find({ doctorId, date }).populate('fileId').populate('userId').populate('doctorId').populate('departmentId');

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAppointmentsByDate = async (req, res) => {
  
  const { userId } = req.params;
  const { date } = req.query;
  try {
    // Tìm tất cả các cuộc hẹn của bác sĩ trong ngày cụ thể
    const appointments = await Appointment.find({ userId, date }).populate('departmentId').populate('userId').populate('doctorId').populate('fileId');
    console.log(appointments);
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getTotalAppointmentsByMonth = async (req, res) => {
  const { doctorId } = req.params;
  const { month, year } = req.query;
  
  try {
    // Chuyển đổi month và year từ string thành số nguyên
    const monthNumber = parseInt(month);
    const yearNumber = parseInt(year);

    // Kiểm tra tính hợp lệ của monthNumber và yearNumber
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12 || isNaN(yearNumber) || yearNumber < 1970 || yearNumber > 3000) {
      return res.status(400).json({ message: 'Invalid month or year format.' });
    }

    // Tạo object Date để lọc theo tháng và năm
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    const nextMonthDate = new Date(yearNumber, monthNumber, 1);
    const endDate = new Date(nextMonthDate.getTime() - 1);

    // Tạo query để đếm số lượng các appointment
    const totalAppointments = await Appointment.countDocuments({
      doctorId,
      date: { $gte: startDate, $lte: endDate }
    });
    
    res.status(200).json(totalAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getPatientRecordsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Tìm các appointment có doctorId tương ứng
    const appointments = await Appointment.find({ doctorId }).populate('userId').populate('fileId');

    // Lấy danh sách các hồ sơ bệnh nhân
    const patientRecords = appointments.map(appointment => ({
      userId: appointment.userId._id,
      username: appointment.userId.username,
      email: appointment.userId.email,
      file: {
        fileId: appointment.fileId._id,
        symptom: appointment.fileId.symptom,
        description: appointment.fileId.description,
        date: appointment.fileId.date,
        status: appointment.fileId.status,
        result: appointment.fileId.result
      }
    }));

    res.status(200).json(patientRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Wait for confirmation', 'Confirmed', 'Complete', 'Overdue'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};