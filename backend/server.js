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
const roomRoutes = require('./routes/rooms');
const app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './wp/stream' );
let path = require( 'path' );

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
app.use('/api/rooms', roomRoutes);

// Serve static files
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

app.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/index.html' );
} );
io.of( '/stream' ).on( 'connection', stream );

// Bắt đầu server
const PORT = process.env.PORT || 3001;
const PORT2 = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
