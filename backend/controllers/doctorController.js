const Doctor = require('../models/doctor');
const Appointment = require('../models/Appointment');

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
  const { name, phone, email, password, department } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newDoctor = new Doctor({ name, phone, email, password: hashedPassword, department });

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

exports.getAvailableDoctors = async (req, res) => {
  const { departmentId } = req.params;
  const { date, time } = req.query;
  try {
    // Tìm tất cả các bác sĩ trong department
    const doctorsInDepartment = await Doctor.find({ department: departmentId });
    console.log(doctorsInDepartment)

    // Tìm tất cả các cuộc hẹn trong thời gian thực
    const appointmentsInTimeSlot = await Appointment.find({ date, time });

    // Lọc ra các bác sĩ không có cuộc hẹn trong thời gian thực
    const availableDoctors = doctorsInDepartment.filter(doctor => 
      !appointmentsInTimeSlot.some(appointment => 
        appointment.doctorId.toString() === doctor._id.toString()
      )
    );

    res.status(200).json(availableDoctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  

exports.getDoctorsByDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    // Tìm tất cả các bác sĩ trong department
    const doctors = await Doctor.find({ department: departmentId }).populate('department', 'name');

    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};