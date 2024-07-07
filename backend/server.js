const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admins');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const departmentRoutes = require('./routes/departments');
const fileRoutes = require('./routes/files');
const timeSlotRoutes = require('./routes/timeSlots');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');

// Allow all origins
app.use(cors());

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
app.use('/api/admins', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/timeSlots', timeSlotRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('offer', payload => {
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', payload => {
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', incoming => {
    io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Bắt đầu server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
