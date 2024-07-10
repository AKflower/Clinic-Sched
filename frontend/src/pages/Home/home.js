import styles from './home.module.scss';
import Card from '../../components/card/card';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import departmentService from '../../services/departmentService';
import appointmentService from '../../services/appointment'
import CardDashBoard from '../../components/card/cardDashboard';

export default function Home () {

    var token = localStorage.getItem('token');
    const doctorId = localStorage.getItem('id');
    const userId = localStorage.getItem('id'); 
    const role = localStorage.getItem('role')
    // const [department,setDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [timeSlot,setTimeSlot] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        if (!token) navigate('/home')
        // Load danh sách Departments khi component được render
        fetchDepartments();
        if (role=='doctor') fetchTimeSlot();
    }, []);

    const fetchDepartments = async () => {
        try {
        const data = await departmentService.getAllDepartments();
        setDepartments(data);
        } catch (error) {
        console.error('Error fetching departments:', error.message);
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
            {departments.map((department,index) => (
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
            <CardDashBoard data={{quant:12,text:'Lịch khám trong tháng'}} goto={'appointment'}/>
            </div>
            
        </div>
    )}
    if (role=='admin') return (
        <div className={styles.container}>
            
       
        </div>
    )
}