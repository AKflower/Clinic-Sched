import styles from './card.module.scss';
import pic1 from '../../assets/images/department/1.png'
import {useNavigate} from 'react-router-dom'

export default function Card({id,name,description}) {
    const navigate = useNavigate()
    const handleClick = () => {
        console.log(id);
        navigate(`/home/doctors?id=${id}`)
        //Redicert
    }
    return (
        <div className={styles.container} onClick={handleClick}>
            <img src={pic1} style={{width: '10em'}}/>
            <h4>Tim mạch</h4>
            <p>Đội ngũ bác sĩ tim mạch giàu kinh nghiệm sẽ giúp bạn quản lý các bệnh lý từ tăng huyết áp đến suy tim, đảm bảo sức khỏe tim mạch của bạn luôn được bảo vệ tốt nhất.</p>
        </div>
    )
}