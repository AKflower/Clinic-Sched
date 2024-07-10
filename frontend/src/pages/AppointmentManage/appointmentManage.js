import styles from './appointmentManage.module.scss';
import appointmentService from '../../services/appointment';
import { useState,useEffect } from 'react';
import Button from '../../components/button/button'

export default function AppointmentManage() {
    const [appointments,setAppointments] = useState([])
    useEffect(() => {
        fetchAppointments();

      }, []);
    const fetchAppointments = async () => {
        try {
        const appointments = await appointmentService.getAllAppointments();
        
        const sortedArray = appointments.sort((a, b) =>  new Date(b.date) - new Date(a.date));
        setAppointments(sortedArray);
        } catch (error) {
        console.error('Error fetching appointments:', error);
        }
    };
    
    return (
        <div className={styles.container}>
        <h2>Quản lý lịch khám</h2>  
            <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Thời gian</th>
                    <th>Người khám</th>
                    <th>Bác sĩ</th>
                    <th>Chuyên khoa</th>
                    <th>Triệu chứng</th>
                    <th></th>
                    </tr>
                    
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr>
                            <td>{formatDate(appointment.date)}</td>
                            <td>{appointment.userId.name}</td>
                            <td>{appointment.doctorId.name}</td>
                            <td>{appointment?.departmentId?.name || ''}</td>
                            <td>{appointment.fileId.symptom}</td>
                            <td><Button name='Xác nhận' color='green'/></td>
                        </tr>
                    ))}
                   
                </tbody>
            </table>
        </div>
    )
}
function formatDate(dateInput) {
    const date = new Date(dateInput)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}