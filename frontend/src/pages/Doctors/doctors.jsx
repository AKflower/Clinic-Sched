import styles from './doctors.module.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import CardDoctor from '../../components/card/cardDoctor';
import { useState, useEffect } from 'react';
import departmentService from '../../services/departmentService';
import doctorService from '../../services/doctorService';

export default function Doctors() {

    const [department, setDepartment] = useState(null); // Khởi tạo department là null ban đầu
    const [doctors, setDoctors] = useState([]);
    const location = useLocation();
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const query = useQuery();
    const id = query.get('id');

    const currentDateTime = new Date();
    const currentDate = formatDate(currentDateTime);
    const currentTime = formatTime(currentDateTime);
    
    useEffect(() => {
        // Load danh sách Departments khi component được render
        fetchDepartment();
        fetchDoctorsWithAvailability(id,currentDate,currentTime);
    }, []);

    const fetchDepartment = async () => {
        try {
            const data = await departmentService.getDepartmentById(id);
            setDepartment(data); // Cập nhật state department sau khi lấy dữ liệu thành công
        } catch (error) {
            console.error('Error fetching department:', error.message);
        }
    };
    const fetchDoctorsWithAvailability = async (departmentId, date, time) => {
        try {
          const data = await doctorService.getDoctorsWithAvailability(departmentId, date, time);
          setDoctors(data);
        } catch (error) {
          console.error('Error fetching doctors with availability:', error.message);
        }
    };

    if (!department) return null; // Nếu department chưa được load, có thể hiển thị loading hoặc return null

    return (
        <div className={styles.container}>
            <h1>Khám {department.name.toLowerCase()}</h1>
            <div className={styles.doctorsContainer}>
               {doctors.map((doctor) => (
                <CardDoctor doctor={doctor} departmentId={id} departmentName={department.name}/>
               ))}
               
                
               
            </div>
        </div>
    );
        
}
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
