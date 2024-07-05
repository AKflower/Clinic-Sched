const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');

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

// Định nghĩa các route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Bắt đầu server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
