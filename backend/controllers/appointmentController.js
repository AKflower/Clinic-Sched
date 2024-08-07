const Appointment = require('../models/appointment');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const mongoose = require('mongoose');
const Review = require('../models/review'); // Import model Review


exports.getAllAppointments = async (req, res) => {
  try {
    let appointments = await Appointment.find().populate('fileId').populate('userId').populate('doctorId').populate('departmentId');
    // Thêm trường isReviewed
    appointments = await Promise.all(appointments.map(async (appointment) => {
      const review = await Review.findOne({ appointmentId: appointment._id });
      return { ...appointment._doc, isReviewed: !!review };
    }));
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('fileId');
    const review = await Review.findOne({ appointmentId: appointment._id });
    const appointmentWithReview = { ...appointment._doc, isReviewed: !!review };
    res.status(200).json(appointmentWithReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAppointmentsByDoctorId = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctorId }).populate('fileId');

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAppointmentDatesByDoctorId = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctorId }, 'date'); // Lấy chỉ trường 'date'

    // Trích xuất các ngày và loại bỏ trùng lặp
    const appointmentDates = [...new Set(appointments.map(app => app.date.toISOString().split('T')[0]))];

    res.status(200).json(appointmentDates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAppointmentDatesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await Appointment.find({ userId }, 'date'); // Lấy chỉ trường 'date'

    // Trích xuất các ngày và loại bỏ trùng lặp
    const appointmentDates = [...new Set(appointments.map(app => app.date.toISOString().split('T')[0]))];

    res.status(200).json(appointmentDates);
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
exports.updateAppointmentUserAttend = async (req, res) => {
  const { userAttend } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, {
     userAttend
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
  try {
    let appointments = await Appointment.find({ doctorId, date }).populate('fileId').populate('userId').populate('doctorId').populate('departmentId').populate('roomId');
    appointments = await Promise.all(appointments.map(async (appointment) => {
      const review = await Review.findOne({ appointmentId: appointment._id });
      return { ...appointment._doc, isReviewed: !!review };
    }));
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAppointmentsByDate = async (req, res) => {
  const { userId } = req.params;
  const { date } = req.query;
  try {
    let appointments = await Appointment.find({ userId, date }).populate('departmentId').populate('userId').populate('doctorId').populate('fileId').populate('roomId');
    appointments = await Promise.all(appointments.map(async (appointment) => {
      const review = await Review.findOne({ appointmentId: appointment._id });
      return { ...appointment._doc, isReviewed: !!review };
    }));
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateActiveAppointment = async (req, res) => {
  const { isActive } = req.body;
  const updateData = { isActive };

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

exports.getTotalAppointmentsByMonth = async (req, res) => {
  const { doctorId } = req.params;
  const { month, year } = req.query;
  
  try {
    const monthNumber = parseInt(month);
    const yearNumber = parseInt(year);

    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12 || isNaN(yearNumber) || yearNumber < 1970 || yearNumber > 3000) {
      return res.status(400).json({ message: 'Invalid month or year format.' });
    }

    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    const nextMonthDate = new Date(yearNumber, monthNumber, 1);
    const endDate = new Date(nextMonthDate.getTime() - 1);

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

  const validStatuses = ['Wait for payment', 'Paid', 'Confirmed', 'Complete', 'Overdue'];
  
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

exports.getWorkingDaysAndDoctors = async (req, res) => {
  const { month, year } = req.params;

  // Chuyển đổi month và year từ string thành số nguyên
  const monthNumber = parseInt(month);
  const yearNumber = parseInt(year);

  // Kiểm tra tính hợp lệ của monthNumber và yearNumber
  if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12 || isNaN(yearNumber) || yearNumber < 1970 || yearNumber > 3000) {
    return res.status(400).json({ message: 'Invalid month or year format.' });
  }

  // Lấy tất cả các bác sĩ
  const doctors = await Doctor.find();

  // Tạo mảng chứa tất cả các ngày trong tháng
  const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Tạo danh sách ngày với bác sĩ làm việc
  const result = await Promise.all(
    daysArray.map(async (day) => {
      const date = new Date(yearNumber, monthNumber - 1, day);

      // Kiểm tra bác sĩ nào đi làm ngày đó
      const workingDoctors = await Promise.all(
        doctors.map(async (doctor) => {

          // Kiểm tra ngày nghỉ của bác sĩ
          const isDayOff = doctor.dayOff.some(dayOff => dayOff.date.toDateString() === date.toDateString());
          
          if (!isDayOff) {
            return {
              id: doctor._id,
              name: doctor.name
            };
          }
          return null;
        })
      );

      return {
        date: date,
        doctors: workingDoctors.filter(doctor => doctor !== null),
      };
    })
  );

  res.status(200).json(result);
};