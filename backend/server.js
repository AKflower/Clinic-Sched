// server.js
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidV4 } = require('uuid');
const app = express();
const server = require('http').Server(app);

// Connect server with Socket



// Connect server with Socket


const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Thay thế bằng địa chỉ của client
    methods: ['GET', 'POST']
  }
});

// Cấu hình CORS cho Express app
app.use(cors());

// Sử dụng body-parser middleware để phân tích cú pháp JSON
app.use(express.json());

// Kết nối tới MongoDB Atlas hoặc local MongoDB
// const mongoURI = 'mongodb+srv://tranquocdungb4:HwnRECAExdn4vLfk@cluster0.jl2mgf9.mongodb.net/Clinic?appName=Cluster0';
const mongoURI = 'mongodb+srv://ngocdtb502:bbuGHbUUBpVkN0Zr@utehealth.etylhol.mongodb.net/UTE-Health?appName=UTEHealth'
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Định nghĩa các route
// Định nghĩa các route
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admins');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const departmentRoutes = require('./routes/departments');
const fileRoutes = require('./routes/files');
const timeSlotRoutes = require('./routes/timeSlots');
const roomRoutes = require('./routes/rooms');
const reviewRoutes = require('./routes/review')


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/timeSlots', timeSlotRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reviews',reviewRoutes)

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
app.get('/', (req, res) => res.redirect(`/${uuidV4()}`));

io.on('connection', (socket) => {
  // Khi có người dùng tham gia vào room
  socket.on('join', (roomId, socketID) => {
      socket.join(roomId);
      socket.to(roomId).emit('new-user-connected', socketID); // Broadcast tới tất cả trừ sender
      console.log(`User ${socketID} joined room ${roomId}`);

      // Xử lý khi người dùng disconnect
      socket.on('disconnect', () => {
          console.log(`User ${socketID} disconnected from room ${roomId}`);
          socket.to(roomId).emit('user-disconnected', socketID); // Broadcast tới tất cả trừ sender
      });
      socket.on('toggle-camera', (peerId, isCameraOn) => {
        console.log(`Received toggle-camera event: ${peerId}, ${isCameraOn}`);
        socket.to(roomId).emit('user-camera-toggled', peerId, isCameraOn);
      });
  });
});


// Bắt đầu server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
