import logo from './logo.svg';
import './App.css';
import Login from './pages/Login/login';
import { BrowserRouter, Route, Link, Routes, useLocation } from 'react-router-dom';
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

const Main = () => {
  const location = useLocation();
  const path = location.pathname;
  console.log(path);

  return (
    <>
      <Sidebar />
      <UserProfile />
      <div className='d-flex main' style={{ margin: '0' }}>
      <ToastContainer />
        <div className='container' style={(path.includes('/login') || path.includes('/register') || path.includes('/forgot')) ? {
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
