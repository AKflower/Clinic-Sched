import styles from './home.module.scss';
import Card from '../../components/card/card';
import { useState, useEffect } from 'react';
import departmentService from '../../services/departmentService';

export default function Home () {
    // const [department,setDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        // Load danh sách Departments khi component được render
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
        const data = await departmentService.getAllDepartments();
        setDepartments(data);
        } catch (error) {
        console.error('Error fetching departments:', error.message);
        }
    };
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
}