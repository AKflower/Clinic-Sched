import styles from './doctors.module.scss'
import { useLocation } from 'react-router-dom';
import CardDoctor from '../../components/card/cardDoctor';
import { useState, useEffect } from 'react';
import departmentService from '../../services/departmentService';

export default function Doctors() {
    const [department, setDepartment] = useState(null); // Khởi tạo department là null ban đầu

    const location = useLocation();
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };
    const query = useQuery();
    const id = query.get('id');

    useEffect(() => {
        // Load danh sách Departments khi component được render
        fetchDepartment();
    }, []);

    const fetchDepartment = async () => {
        try {
            const data = await departmentService.getDepartmentById(id);
            setDepartment(data); // Cập nhật state department sau khi lấy dữ liệu thành công
        } catch (error) {
            console.error('Error fetching department:', error.message);
        }
    };

    if (!department) return null; // Nếu department chưa được load, có thể hiển thị loading hoặc return null

    return (
        <div className={styles.container}>
            <h1>Khám {department.name.toLowerCase()}</h1>
            <div className={styles.doctorsContainer}>
               
                <CardDoctor  />
                <CardDoctor  />
                <CardDoctor />
               
            </div>
        </div>
    );
}
