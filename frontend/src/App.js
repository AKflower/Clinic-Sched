import logo from './logo.svg';
import './App.css';
import Login from './pages/Login/login';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Register from './pages/Register/register';
import ForgotPassword from './pages/ForgotPassword/forgotPassword';
import Sidebar from './components/sidebar/sidebar';
import UserProfile from './components/userProfile/userProfile';
import Home from './pages/Home/home';
import Doctors from './pages/Doctors/doctors';
import File from './pages/File/file';

function App() {
  return (
    <BrowserRouter>
    <Sidebar />
    <UserProfile />
      
        
     <div className='d-flex main' style={{margin:'0'}}>
     <div className='container'>
      <Routes>
      <Route  path="/login" element={<Login />}  />
      <Route path="/register" element={<Register />}/>
      <Route path='/forgot' element={<ForgotPassword />} />

      <Route path='/home' element={<Home />} />
      <Route path='/home/doctors' element={<Doctors />} />
      <Route path='/file' element={<File />} />
      
    
      </Routes>
      </div>
      </div>
    </BrowserRouter>
   
    
   
  );
}

export default App;
