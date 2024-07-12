import logo from './logo.svg';
import './App.css';
import Login from './pages/Login/login';
import { BrowserRouter, Route, Link, Routes, useLocation, useNavigate } from 'react-router-dom';
import Register from './pages/Register/register';
import ForgotPassword from './pages/ForgotPassword/forgotPassword';
import Sidebar from './components/sidebar/sidebar';
import UserProfile from './components/userProfile/userProfile';
import Home from './pages/Home/home';
import Doctors from './pages/Doctors/doctors';
import File from './pages/File/file';
import Booking from './pages/Booking/booking'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Appointment from './pages/Appointment/appointment'
import AppointmentManage from './pages/AppointmentManage/appointmentManage'
import User from './pages/User/user'
import Doctor from './pages/Doctor/doctor'
import FileManage from './pages/FileManage/fileManage';
import Department from './pages/Department/department'
import { useEffect} from 'react'
import Schedule from './pages/Schedule/schedule';
import ScheduleManage from './pages/ScheduleManage/scheduleManage';
import Room from './pages/Room/room';


const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const path = location.pathname;
    if (!token && !path.includes('/login') && !path.includes('/register') && !path.includes('/forgot')) {
      navigate('/login');
    }
  }, [location, navigate]);

  const path = location.pathname;
  return (
    <>
      <Sidebar />
      <UserProfile />
      <div className='d-flex main' style={{ margin: '0' }}>
      <ToastContainer />
        <div className='container' style={(path.includes('/login') || path.includes('/register') || path.includes('/forgot')) || path.includes('/room') ? {
          margin: '0',
          width: '100vw',
          padding: '0'
        } : {}}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/doctors" element={<Doctors />} />
            <Route path="/file" element={<File />} />
            <Route path="/home/doctors/booking" element={<Booking />} />
            <Route path='/appointment' element={<Appointment />} />
            <Route path='/manage_user' element={<User />} />
            <Route path='/manage_doctor' element={<Doctor />} />
            <Route path='/manage_appointment' element={<AppointmentManage />} />
            <Route path='/manage_file' element={<FileManage />} />
            <Route path='/manage_department' element={<Department />} />
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/manage_schedule' element={<ScheduleManage />} />
            <Route path='/room' element={<Room />} />
            </Routes>
        </div>
      </div>
    </>
  );
};

function App() {

  return (
    <BrowserRouter>
    <Main />
    </BrowserRouter>
   
    
   
  );
}

export default App;