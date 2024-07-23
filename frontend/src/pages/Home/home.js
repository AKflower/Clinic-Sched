import styles from './home.module.scss';
import Card from '../../components/card/card';
import UserService from '../../services/userService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import departmentService from '../../services/departmentService';
import appointmentService from '../../services/appointment'
import doctorService from '../../services/doctorService';
import fileService from '../../services/fileService';
import AppointmentChart from '../../components/Chart/chart'

import CardDashBoard from '../../components/card/cardDashboard';

export default function Home () {

    var token = localStorage.getItem('token');
    const doctorId = localStorage.getItem('id');
    const userId = localStorage.getItem('id'); 
    const role = localStorage.getItem('role')
    // const [department,setDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments,setAppointments] = useState([])
    const [files, setFiles] = useState([]);
    const [workingDaysCount, setWorkingDaysCount] = useState(0);
    const [revenue,setRevenue] = useState(0)



    const [timeSlot,setTimeSlot] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        if (!token) navigate('/home')
        if (role =='user') {
            fetchDepartments();
        }
        // Load danh sách Departments khi component được render
        if (role=='admin') {
            fetchDepartments();
            fetchAppointments();    
            fetchDoctors();
            fetchUsers();
            fetchFiles();
            
        }
           
        if (role=='doctor') {
            fetchWorkingDays();
            fetchTimeSlot();
        }
    }, []);
    const fetchFiles = async () => {
        try {
          const data = await fileService.getAllFiles(userId);
          data.sort((a,b) => b.fileid-a.fileid);
          setFiles(data);
        } catch (error) {
          console.error('Error fetching files:', error.message);
        }
      };
    const fetchUsers = async () => {
        try {
          const users = await UserService.getAllUsers();
          setUsers(users);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
    const fetchDepartments = async () => {
        try {
        const data = await departmentService.getAllDepartments();
        setDepartments(data);
        } catch (error) {
        console.error('Error fetching departments:', error.message);
        }
    };
    const fetchWorkingDays = async () => {
        const currentDate = new Date(); // Ngày và giờ hiện tại
        const currentMonth = currentDate.getMonth() + 1; // Tháng hiện tại (tháng bắt đầu từ 0 nên cộng thêm 1)
        const currentYear = currentDate.getFullYear(); 
  
        try {
          const count = await doctorService.getWorkingDaysByMonth(doctorId, currentMonth, currentYear);
          setWorkingDaysCount(count);
        } catch (error) {
          console.error('Error fetching working days:', error);
        }
      };
  
    
    const fetchDoctors = async () => {
        try {
        const doctors = await doctorService.getAllDoctors();
        setDoctors(doctors);

        } catch (error) {
        console.error('Error fetching doctors:', error);
        }
    };
    const fetchAppointments = async () => {
        try {
        const appointments = await appointmentService.getAllAppointments();
        var count = 0;
        appointments.forEach((appointment) => {
          if (appointment.status == 'Complete') count++;
        })
        setRevenue(count);
        setAppointments(appointments);
        } catch (error) {
        console.error('Error fetching appointments:', error);
        }
    };
    const fetchTimeSlot = async () => {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
       

        const data = await appointmentService.getDoctorAppointmentsTimeByDate(doctorId,formattedDate);
        

        setTimeSlot(data)
      }
    if (role=='user')
    return (
        <div className={styles.container}>
            <h1>Đặt khám</h1>
            <div className={styles.departmentContainer}>
            {departments.map((department,index) => ( department.isActive &&
                <Card key={department._id} name={department.name} id={department._id} index={index} description={department.description}/>
    ))}
              
                
            </div>
            
        </div>
    )
    if (role=='doctor')  {
       
        return (
        <div className={styles.container}>
            <h1>Thống kê</h1>
            <div className={styles.departmentContainer}>
            <CardDashBoard data={{quant:timeSlot.length,text:'Lịch khám hôm nay'}} goto={'appointment'}/>
            <CardDashBoard data={{quant:workingDaysCount,text:'Lịch khám trong tháng'}} goto={'appointment'}/>
            </div>
            
        </div>
    )}
    if (role=='admin') return (
        <div className={styles.container}>
        <h1>Thống kê</h1>
        <div className={styles.departmentContainer}>
            <CardDashBoard data={{quant:users.length,text:'Người dùng'}} goto={'manage_user'}/>
            <CardDashBoard data={{quant:doctors.length,text:'Bác sĩ'}} goto={'manage_doctor'}/>
            <CardDashBoard data={{quant:files.length,text:'Hồ sơ bệnh án'}} goto={'manage_file'}/>
            <CardDashBoard data={{quant:convertNumbers(revenue*100000),text:'Tổng doanh thu'}} goto={'manage_appointment'}/>
         
        </div>
        <AppointmentChart appointments={appointments}/>
        
    </div>
    )
}
function convertNumbers(num) {
  if (num>=10000) num=num/1000 + 'K';
  else if (num>=1000000) num=num/1000000 + 'M';
  else if (num>=1000000000) num = num / 1000000000 + 'B'
  return num;
}