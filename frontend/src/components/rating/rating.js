import { useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import StarIcon from '@mui/icons-material/Star';
import styles from './rating.module.scss';
import Input from '../../components/input/input';
import Button from '../../components/button/button'
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'
import reviewService from '../../services/reviewService';


const RatingComponent = ({data}) => {
  const [feedback, setFeedback] = useState('');
const navigate = useNavigate()
const starsData = [
    {
        id:1,
        isTick: false,
    },
    {
        id:2,
        isTick: false,
    },
    {
        id:3,
        isTick: false,
    },
    {
        id:4,
        isTick: false,
    },
    {
        id:5,
        isTick: false,
    }
    
]
    const [stars, setStars] = useState(starsData);
    

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async () => {
    // Xử lý gửi rating và feedback lên server hoặc xử lý theo nhu cầu của bạn
    
    var starPoint = stars.filter(star=> star.isTick).length;
    if (starPoint == 0) {
        toast.warning('Xin vui lòng chọn số sao!')
    }
    const review = await reviewService.createReview({
      appointmentId: data._id,
      userId: data.userId,
      doctorId: data.doctorId,
      departmentId: data.departmentId,
      rating: starPoint,
      feedback: feedback,
    });
    toast.success('Xin cảm ơn!')
    navigate('/home')
  };
  const handleRatingHover = (id) => {
    console.log('test');
    
    const updatedStars = stars.map((star, index) => ({
        ...star,
        isTick: index < id,
      }));
      setStars(updatedStars);
    
  }
  const handleSkip = () => {
    navigate('/home');
  }
  
  return (
    <div>

     {/* <ReactStars
        count={5}
        onChange={ratingChanged}
        size={24}
        activeColor="#ffd700"
  /> */}
    <div className={styles.starComponent}>
    {stars.map((star) => (
        <span key={`star${star.id}`} onMouseEnter={() => handleRatingHover(star.id)} style={{ color: star.isTick ? 'yellow' : 'silver', fontSize: '3em',cursor:'pointer' }} ><StarIcon fontSize='inherit'/></span>
    ))}
    </div>
    <div style={{width:'40vw',height:'30vh'}}>
        <Input value={feedback} onChange={handleFeedbackChange} label={'Nhận xét'} isTextArea={true} placeholder={'Để lại nhận xét là cách để chúng tôi phục vụ bạn tốt hơn...'}/>
        <div className={styles.button}>
            <Button color='silver' name={'Bỏ qua'} onClick={handleSkip}/>
            <Button onClick={handleSubmit} name={'Gửi đánh giá'} />
        </div>
        
       
    </div>
     
     
    </div>
  );
};

export default RatingComponent;
