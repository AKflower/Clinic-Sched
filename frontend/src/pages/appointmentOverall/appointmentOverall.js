import styles from './appointmentOverall.module.scss';
import CalendarComponent from '../../components/calendar/calendar';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../../services/appointment';
import { useEffect, useState } from 'react';

export default function AppointmentOverall() {
  const [dates, setDates] = useState([]);
  const id = localStorage.getItem('id'); // Get id after it's defined
  const role = localStorage.getItem('role'); // Get role after it's defined
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        var arrDates = [] 
        if (role=='doctor')
        arrDates=  await appointmentService.getAppointmentDatesByDoctorId(id);
        else arrDates=  await appointmentService.getAppointmentDatesByUserId(id);
        const adjustedDates = arrDates.map(date => {
          const dateObj = new Date(date);
          dateObj.setDate(dateObj.getDate() - 1);
          return dateObj.toISOString().split('T')[0]; // Format as yyyy-mm-dd
        });
        setDates(adjustedDates);
      } catch (error) {
        console.error('Error fetching appointment dates:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]); // Fetch dates only when id changes

  const handleChangeDate = (date) => {
    const dateInput = new Date(date);
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, '0'); // Month in JavaScript starts from 0
    const day = String(dateInput.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    navigate(`/appointment?day=${formattedDate}`);
  };

  return (
    <div className={styles.container}>
    <h1>Lịch khám</h1>
    <CalendarComponent onChange={handleChangeDate} appointmentDates={dates} />
    </div>
   
    )
}
