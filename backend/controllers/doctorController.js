const Doctor = require('../models/doctor');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addDoctor = async (req, res) => {
  const { name, phone, gender, email, password, department } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newDoctor = new Doctor({ name, phone, gender, email, password: hashedPassword, department });

  try {
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  const { name, phone, email, password, department } = req.body;
  const updateData = { name, phone, email, department };
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Doctor deleted successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getDoctorsWithAvailability = async (req, res) => {
  const { departmentId } = req.params;
  const { date, time } = req.query;

  const timeSlots = [
    { id: 0, name: '8:00', time: '08:00' },
    { id: 1, name: '8:30', time: '08:30' },
    { id: 2, name: '9:00', time: '09:00' },
    { id: 3, name: '9:30', time: '09:30' },
    { id: 4, name: '10:00', time: '10:00' },
    { id: 5, name: '10:30', time: '10:30' },
    { id: 6, name: '11:00', time: '11:00' },
    { id: 7, name: '11:30', time: '11:30' },
    { id: 8, name: '13:00', time: '13:00' },
    { id: 9, name: '13:30', time: '13:30' },
    { id: 10, name: '14:00', time: '14:00' },
    { id: 11, name: '14:30', time: '14:30' },
    { id: 12, name: '15:00', time: '15:00' },
    { id: 13, name: '15:30', time: '15:30' },
    { id: 14, name: '16:00', time: '16:00' },
    { id: 15, name: '16:30', time: '16:30' },
  ];
  
  try {
    // Tìm tất cả các bác sĩ trong department
    const doctorsInDepartment = await Doctor.find({ department: departmentId }).populate('department', 'name');

    // Tìm tất cả các cuộc hẹn trong thời gian thực
    const appointmentsInTimeSlot = await Appointment.find({ date, time });

    // Tạo danh sách các bác sĩ với trạng thái bận rộn
    const doctorsWithAvailability = doctorsInDepartment.map(doctor => {
      const isBusy = appointmentsInTimeSlot.some(appointment => 
        appointment.doctorId.toString() === doctor._id.toString()
      );

      return {
        ...doctor._doc,
        isBusy
      };
    });

    res.status(200).json(doctorsWithAvailability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};