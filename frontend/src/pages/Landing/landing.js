import styles from './landing.module.scss'
import Brand from '../../components/brand/brand'
import Button from '../../components/button/button'
import cover from '../../assets/images/cover.png'
import doctor from '../../assets/images/doctor.png'
import CardDoctor from '../../components/card/cardDoctor'
import {useNavigate} from 'react-router-dom'
import reviewService from '../../services/reviewService'
import {useEffect, useState} from 'react'

export default function Landing() {
    const navigate = useNavigate()
    const [ratestDoctor,setRatestDoctor] = useState([])

const fetchTopRatedDoctors = async () => {
    try {
      const topRatedDoctors = await reviewService.getTopRatedDoctors();
      console.log(topRatedDoctors);
      setRatestDoctor(topRatedDoctors)
    } catch (error) {
      console.error('Error fetching top rated doctors:', error);
    }
  };
  useEffect(()=> {
    fetchTopRatedDoctors()
  },[])
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Brand size={1.2} />
                <div style={{width:'10em',margin:'0 1em 0 0'}}><Button name={'Đặt lịch ngay'} onClick={()=> navigate('/login')}/></div>
            </header>
            <div className={styles.cover}>
                <img src={cover} />
                <div className={styles.content}>
                    <h1>Chăm sóc sức khỏe của bạn, dễ dàng và thuận tiện hơn bao giờ hết. </h1>
                    <p>Đặt lịch tư vấn trực tuyến ngay hôm nay!</p>
                </div>
            </div>
            <div className={styles.about}>
                <img src={doctor} />
                <div className={styles.content}>
                    <h1 style={{color:'#62DCDC'}}>Về chúng tôi</h1>
                    <p>Chào mừng bạn đến với UTEHealth, nền tảng đặt lịch tư vấn trực tuyến tiên tiến, giúp việc chăm sóc sức khỏe của bạn trở nên dễ dàng và thuận tiện hơn bao giờ hết. Chúng tôi mang đến một giải pháp toàn diện cho mọi nhu cầu y tế của bạn, từ việc tìm kiếm bác sĩ đến việc đặt lịch hẹn và nhận tư vấn y tế chuyên nghiệp.</p>
                </div>
            </div>
            <div className={styles.doctors}>
                
                <h1 style={{textAlign:'center',color:'white'}}>Bác sĩ nổi bật</h1>
               
                <div className={styles.doctorsContainer}>
                    {ratestDoctor.map((doctor) => (
                        <CardDoctor doctor={{name:doctor.doctorName,gender:doctor.gender}} isFake={true} />
                    ))
                     }
                   
                    

                </div>
            </div>
        </div>
    )
}