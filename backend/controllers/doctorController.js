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

exports.updateDayOff = async (req, res) => {
  const { id } = req.params;
  const { date, reason } = req.body.dayOff;
  console.log('Khoa: ',date,reason);
  try {
    // Tìm bác sĩ dựa trên doctorId
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Thêm vào mảng holidays của bác sĩ
    doctor.dayOff.push({ date, reason });

    // Lưu lại thông tin và trả về response
    await doctor.save();
    res.status(200).json({ message: 'dayOff added successfully.', doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
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

exports.updateActiveDoctor = async (req, res) => {
  const { isActive } = req.body;
  const updateData = { isActive };

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

exports.updateForgot = async (req, res) => {
  const updateData = { isForgot: true };

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const updateData = { password: hashedPassword };

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const doctors = await Doctor.findById(req.params.id);
  const hashedPassword = await bcrypt.hash(doctors.phone, 10);

  const updateData = { 
    password: hashedPassword,
    isForgot: false
   };

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getDoctorsWithAvailability = async (req, res) => {
  const { departmentId } = req.params;
  const { date, time } = req.query;

  function isWeekend(date) {
    const d = new Date(date);
    
    const day = d.getDay();
     
    return day === 0 || day === 6;
  }

function findTimeSlot(time) {
  const [hours, minutes] = time.split(':').map(Number);
  if(hours < 8) return -1;
  if((minutes >= 20 && minutes < 30) || (minutes >= 50 && minutes <= 59)) return -1;
  const currentTime = new Date();
  currentTime.setHours(hours, minutes, 0, 0);

  for (let i = 0; i < timeSlots.length; i++) {
    const [slotHours, slotMinutes] = timeSlots[i].time.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(slotHours, slotMinutes, 0, 0);

    if (currentTime <= slotTime) {
      return timeSlots[i-1].id;
    }
  }

  return -1; 
}
const timeSlots = [
  { id: 1, name: '8:00', time: '08:00' },
  { id: 2, name: '8:30', time: '08:30' },
  { id: 3, name: '9:00', time: '09:00' },
  { id: 4, name: '9:30', time: '09:30' },
  { id: 5, name: '10:00', time: '10:00' },
  { id: 6, name: '10:30', time: '10:30' },
  { id: 7, name: '11:00', time: '11:00' },
  { id: 8, name: '11:30', time: '11:30' },
  { id: 9, name: '13:00', time: '13:00' },
  { id: 10, name: '13:30', time: '13:30' },
  { id: 11, name: '14:00', time: '14:00' },
  { id: 12, name: '14:30', time: '14:30' },
  { id: 13, name: '15:00', time: '15:00' },
  { id: 14, name: '15:30', time: '15:30' },
  { id: 15, name: '16:00', time: '16:00' },
  { id: 16, name: '16:30', time: '16:30' },
];

const timeId = findTimeSlot(time);
console.log(timeId)

try {
 
  // Tìm tất cả các bác sĩ trong department
  const doctorsInDepartment = await Doctor.find({ department: departmentId }).populate('department', 'name');
 
  // Tìm tất cả các cuộc hẹn trong thời gian thực
  const appointmentsInTimeSlot = await Appointment.find({ date, timeId });

  const currentDate = new Date(date);

  // Tạo danh sách các bác sĩ với trạng thái bận rộn
  const doctorsWithAvailability = doctorsInDepartment
    .filter(doctor => !doctor.dayOff.some(dayOff => 
      dayOff.date.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
    ))
    .map(doctor => {
    let isBusy = appointmentsInTimeSlot.some(appointment => 
      appointment.doctorId.toString() === doctor._id.toString()
    );
    if (isWeekend(date)) return {
      ...doctor._doc,
      isBusy:true
    };
    if (timeId == -1 ) return {
      ...doctor._doc,
      isBusy:true
    };
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



exports.getWorkingDoctor = async (req, res) => {
  const { date } = req.params;
  console.log(date)
  try {
    const queryDate = new Date(date);

    if (isNaN(queryDate)) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }

    // Tìm bác sĩ không có lịch nghỉ trong ngày này
    const doctors = await Doctor.find({
      $nor: [
        {
          dayOff: {
            $elemMatch: {
              date
            }
          }
        }
      ]
    });
  

    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getWorkingDaysByMonth = async (req, res) => {
  const { id } = req.params;
  console.log(req.query);
  const { month, year } = req.query;
  console.log(month,year);
  try {
    const monthNumber = parseInt(month);
    const yearNumber = parseInt(year);

    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12 || isNaN(yearNumber) || yearNumber < 1970 || yearNumber > 3000) {
      return res.status(400).json({ message: 'Invalid month or year format.' });
    }

    const startDate = new Date(yearNumber, monthNumber - 1, 1);
    const endDate = new Date(yearNumber, monthNumber, 0);

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const workingDays = [];
    for (let day = 1; day <= endDate.getDate(); day++) {
      const currentDate = new Date(yearNumber, monthNumber - 1, day);
      const isDayOff = doctor.dayOff.some(dayOff =>
        dayOff.date.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
      );

      if (!isDayOff) {
        workingDays.push(currentDate);
      }
    }

    res.status(200).json(workingDays.length);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

