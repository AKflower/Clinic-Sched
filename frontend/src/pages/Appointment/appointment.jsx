import styles from './appointment.module.scss';
import { useState, useEffect } from 'react';
import appointmentService from '../../services/appointment';
import Input from '../../components/input/input';

export default function Appointment () {
    const role = localStorage.getItem('role')
    const timeSlotsData = [
        { id: 1, name: '8:00', time: '08:00' },
        { id: 2, name: '8:30', time: '08:30' },
        { id: 3, name: '9:00', time: '09:00' },
        { id: 4, name: '9:30', time: '09:30' },
        { id: 5, name: '10:00', time: '10:00' },
        { id: 6, name: '10:30', time: '10:30' },
        { id: 7, name: '11:00', time: '11:00' },
        { id: 8, name: '11:30', time: '11:30' },
        { id: 9, name: '13:00', time: '13:00' },
        { id: 10, name: '13:30', time: '13:30' },
        { id: 11, name: '14:00', time: '14:00' },
        { id: 12, name: '14:30', time: '14:30' },
        { id: 13, name: '15:00', time: '15:00' },
        { id: 14, name: '15:30', time: '15:30' },
        { id: 15, name: '16:00', time: '16:00' },
        { id: 16, name: '16:30', time: '16:30' },
      ];
      
    const [timeSlots,setTimeSlots] = useState(timeSlotsData)
    const [appointments, setAppointments] = useState([]);
    const [appointmentTimes, setAppointmentTimes] = useState([]);
    const [date,setDate] = useState(new Date())
   // Hoặc lấy doctorId từ nguồn khác
    const doctorId = localStorage.getItem('id');
    const userId = localStorage.getItem('id'); // Hoặc lấy userId từ nguồn khác
   
  
    const fetchDoctorAppointmentsByDate = async (doctorId, date) => {
      try {
        const appointments = await appointmentService.getDoctorAppointmentsByDate(doctorId, date.toISOString().split('T')[0]);
        setAppointments(appointments); // Cập nhật state appointments với dữ liệu mới
        appointments.forEach((appointment) => {
            var temp = timeSlots.find((a) => 
                a.id === appointment.timeId
            )
            temp.doctorId = appointment.doctorId;
            temp.userId = appointment.userId;
            temp.fileId = appointment.fileId;
        })
      } catch (error) {
        console.error('Error fetching doctor appointments:', error.message);
      }
    };
  
    const fetchDoctorAppointmentsTimeByDate = async (doctorId, date) => {
      try {
        const appointments = await appointmentService.getDoctorAppointmentsTimeByDate(doctorId, date.toISOString().split('T')[0]);
        setAppointments(appointments); // Cập nhật state appointmentTimes với dữ liệu mới
      } catch (error) {
        console.error('Error fetching doctor appointment times:', error.message);
      }
    };
  
    const fetchUserAppointmentsByDate = async (userId, date) => {
      try {
        const appointments = await appointmentService.getUserAppointmentsByDate(userId, date.toISOString().split('T')[0]);
        appointments.forEach((appointment) => {
            var temp = timeSlots.find((a) => 
                a.id === appointment.timeId
            )
            temp.doctorId = appointment.doctorId;
            temp.userId = appointment.userId;
            temp.fileId = appointment.fileId;
            
        })
        setAppointments(appointments); // Cập nhật state appointments với dữ liệu mới
      } catch (error) {
        console.error('Error fetching user appointments:', error.message);
      }
    };
    const handleChangeDate = (e) => {
      var newDate  = e.target.value
      setDate(newDate);
      if (role=='doctor')
      {if (doctorId && newDate) {
        fetchDoctorAppointmentsByDate(doctorId, newDate);
        // fetchDoctorAppointmentsTimeByDate(doctorId, date);
      }}
    else
      if (userId && newDate) {
        fetchUserAppointmentsByDate(userId, newDate);
        
      }
      
    }
    useEffect(() => {
        
    if (role=='doctor')
      {if (doctorId && date) {
        fetchDoctorAppointmentsByDate(doctorId, date);
        // fetchDoctorAppointmentsTimeByDate(doctorId, date);
      }}
    else
      if (userId && date) {
        fetchUserAppointmentsByDate(userId, date);
        
      }
    }, [ ]);
    if (!appointments) return null;
    else if (role=='user') return   (

        <div className={styles.container}>
        <h1>Lịch khám</h1>  
        <div className={styles.date}>
        <Input label='Chọn ngày' type="date" value={formatDateYYYMMDD(date)} onChange={handleChangeDate}/>
        </div>
       
        <div className={styles.appointmentList}>
        {timeSlots.map((timeSlot) => (
            <div className={styles.appointmentContainer}>
                <div className={styles.timeSlot}>{timeSlot.name}</div>
               {timeSlot.doctorId && <div className={styles.content}>
                    <div style={{fontWeight:'600'}}>Bác sĩ {timeSlot.doctorId && timeSlot.doctorId.name}</div>
                    <div style={{fontSize:'.75em'}}><span >{timeSlot.userId.name}</span> </div>
                    <div style={{fontSize:'.75em'}}><span>Mã hồ sơ: #{timeSlot.fileId && timeSlot.fileId.fileid}</span></div>
                    <div style={{fontSize:'.75em'}}><span>Triệu chứng: {timeSlot.fileId && timeSlot.fileId.symptom}</span></div>
                </div>}
            </div>
        )

        )}
        </div>
            
        </div>
    
    )
    else if (role=='doctor') return (
        <div className={styles.container}>
        <h1>Lịch khám</h1>  
        <div className={styles.appointmentList}>
        {timeSlots.map((timeSlot) => (
            <div className={styles.appointmentContainer}>
                <div className={styles.timeSlot}>{timeSlot.name}</div>
               {
                timeSlot.doctorId && <div className={styles.content}>
                    <div style={{fontWeight:'600'}}>{timeSlot.userId && timeSlot.userId.name} - {timeSlot.fileId && formatDate(timeSlot.fileId.birthDate)}</div>
                    <div style={{fontSize:'.75em'}}><span>Mã hồ sơ: #{timeSlot.fileId && timeSlot.fileId.fileid}</span></div>
                    <div style={{fontSize:'.75em'}}><span>Triệu chứng: {timeSlot.fileId && timeSlot.fileId.symptom}</span></div>
                </div>
            }
            </div>
        )

        )}
        </div>
            
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
function formatDateYYYMMDD(dateInput) {
  const date = new Date(dateInput)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear();
  return `${year}-${day}-${month}`;
}