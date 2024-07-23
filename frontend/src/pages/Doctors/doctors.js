import styles from './doctors.module.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import CardDoctor from '../../components/card/cardDoctor';
import { useState, useEffect } from 'react';
import departmentService from '../../services/departmentService';
import doctorService from '../../services/doctorService';
import reviewService from '../../services/reviewService'
import StarIcon from '@mui/icons-material/Star';


export default function Doctors() {

    const [department, setDepartment] = useState(null); // Khởi tạo department là null ban đầu
    const [reviews,setReviews] = useState([])
    const [doctors, setDoctors] = useState([]);
    const [ratingCount,setRatingCount] = useState(0)
    const location = useLocation();
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const query = useQuery();
    const id = query.get('id');

    const currentDateTime = new Date();
    const currentDate = formatDate(currentDateTime);
    const currentTime = formatTime(currentDateTime);
    
    useEffect(() => {
        // Load danh sách Departments khi component được render
        fetchDepartment();
        fetchDoctorsWithAvailability(id,currentDate,currentTime);
        fetchReviews()
    }, []);
    const fetchReviews = async () => {
        try {
            const data =  await reviewService.getReviewsByDepartment(id);
            var sum = 0;
            data.forEach((item) => {
                sum = sum + item.rating;
            })
            setRatingCount(sum);
            setReviews(data)
        }
        catch (err) {

        }
    }
    const fetchDepartment = async () => {
        try {
            const data = await departmentService.getDepartmentById(id);
            setDepartment(data); // Cập nhật state department sau khi lấy dữ liệu thành công
        } catch (error) {
            console.error('Error fetching department:', error.message);
        }
    };
    const fetchDoctorsWithAvailability = async (departmentId, date, time) => {
        try {
          const data = await doctorService.getDoctorsWithAvailability(departmentId, date, time);
          data.forEach((item) => {
            if (item.reviews) {
                var sum = 0;
                item.reviews.forEach((review) => {
                    sum=sum+review.rating;
                })
                item.ratings = sum;
            }
            else {
                item.reviews=[];
                item.ratings = 0;
            }
          })
          setDoctors(data);
        } catch (error) {
          console.error('Error fetching doctors with availability:', error.message);
        }
    };
    
    if (!department) return null; // Nếu department chưa được load, có thể hiển thị loading hoặc return null

    return (
        <div className={styles.container}>
            <div className={styles.header}><h1>Khám {department.name.toLowerCase()}</h1>
            {/*reviews.length>0 && <h3 className='d-flex center' style={{color:'#b9b43b'}}>
                {formatRating(ratingCount/reviews.length)} 
                <StarIcon /> 
                <span  style={{color:'#000'}}>/ {reviews.length} lượt đánh giá</span></h3>
    */}
            </div>
            <div className={styles.doctorsContainer}>
               {doctors.map((doctor) => (doctor.isActive &&
                <CardDoctor doctor={doctor} departmentId={id} departmentName={department.name} rating={doctor.reviews.length>0 ? doctor.ratings/doctor.reviews.length : null}/>
               ))}
               
                
               
            </div>
        </div>
    );
        
}
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
const formatRating = (num) => {
    return parseFloat((Math.ceil(num * 10) / 10).toFixed(1));
}