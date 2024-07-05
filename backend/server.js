const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');
const app = express();

// Sử dụng body-parser middleware để phân tích cú pháp JSON
app.use(express.json());

// Kết nối tới MongoDB Atlas hoặc local MongoDB
const mongoURI = 'mongodb+srv://tranquocdungb4:HwnRECAExdn4vLfk@cluster0.jl2mgf9.mongodb.net/Clinic?appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Tạo route để thêm người dùng mới
app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Tạo route để thêm bác sĩ mới
app.post('/doctors', async (req, res) => {
  const newDoctor = new Doctor(req.body);
  try {
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Tạo route để thêm cuộc hẹn mới
app.post('/appointments', async (req, res) => {
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
      $push: { appointments: savedAppointment.mongoose.Types.ObjectId }
    });

    // Cập nhật mảng appointments của doctor
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { appointments: savedAppointment._id }
    });

    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Tạo route để lấy tất cả người dùng
app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    // .populate('appointments');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo route để lấy tất cả bác sĩ
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find()
    // .populate('appointments');
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo route để lấy tất cả cuộc hẹn
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      // .populate('userId', 'name email')
      // .populate('doctorId', 'name email department');
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bắt đầu server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
