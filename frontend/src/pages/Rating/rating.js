import styles from './rating.module.scss'
import RatingComponent from '../../components/rating/rating'
import { useLocation, useNavigate } from 'react-router-dom';
import roomService from '../../services/roomService';
import {useEffect, useState} from 'react'
import appointmentService from '../../services/appointment';


export default function Rating() {
    const location = useLocation();
    const useQuery = () => new URLSearchParams(location.search);
    const query = useQuery();
    const appointmentId = query.get('id');
    const [appointment,setAppointment] = useState(null)
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');

    useEffect(() => {
        const fetchAppointment = async () => {
          try {
            const appointmentData = await appointmentService.getAppointmentById(appointmentId);
            if (role=='doctor' && appointmentData.doctorId!=id) navigate('/home');
            if (role=='user' && appointmentData.userId!=id) navigate('/home') ;
            setAppointment(appointmentData);
          } catch (err) {
            console.error('Error fetching room data:', err);
          }
        };
    
        if (appointmentId) {
            fetchAppointment();
        }
      }, [appointmentId]);
    if (!appointment) return null;
    return (
        <div className={styles.container}>
            <h1>Đánh giá buổi hẹn</h1>
            <RatingComponent  data={appointment}/>
        </div>
    )
}