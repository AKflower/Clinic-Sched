import styles from './cardDoctor.module.scss'
import doctor1 from '../../assets/images/doctors/1.png'
import Button from '../button/button'
import { useNavigate } from 'react-router-dom'

export default function CardDoctor({doctor,departmentId,departmentName}) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/home/doctors/booking?departmentId=${departmentId}&doctorId=${doctor._id}`)
    }
    return (
        <div className={styles.container}> 
            <img src={doctor1} />
            <p>Bác sĩ</p>
            <h4>{doctor.name}</h4>
            <div  className={styles.buttonContainer}>
                <Button name={'Đặt lịch'} color='#37A4F3' onClick={handleClick}/>
                {!doctor.isBusy && <Button name={'Gọi ngay'} color='#17BB4F'/>}
            </div>
            
        </div>
    )
}