import styles from './appointmentManage.module.scss';
import appointmentService from '../../services/appointment';
import { useState,useEffect } from 'react';
import Button from '../../components/button/button'
import Input from '../../components/input/input';

export default function AppointmentManage() {
    const [appointments,setAppointments] = useState([])
    const [appointmentsBackup,setAppointmentsBackup] =  useState([]);
    useEffect(() => {
        fetchAppointments();

      }, []);
    const fetchAppointments = async () => {
        try {
        const appointments = await appointmentService.getAllAppointments();
        
        const sortedArray = appointments.sort((a, b) =>  new Date(b.date) - new Date(a.date));
        setAppointments(sortedArray);
        setAppointmentsBackup(sortedArray);
        } catch (error) {
        console.error('Error fetching appointments:', error);
        }
    };
    const handleFilter = async (e) => {
      
        const {value} = e.target;
        if (value=='' || value==null) fetchAppointments()
        console.log(value);
     
        var temp = appointmentsBackup.filter((app) => app.date.split("T")[0]==value);
        setAppointments(temp);
      }
    
    return (
        <div className={styles.container}>
        <div className={styles.header}>
        <h2>Quản lý lịch khám</h2>  
        <div style={{    width: '20em', margin:'0 0 1em 0'}}>
          <Input label={'Ngày khám'} onChange={handleFilter} type={'date'}/>
        </div> 
        </div>
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