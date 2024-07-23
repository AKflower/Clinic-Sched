import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Thay đổi URL của API nếu cần
const token = localStorage.getItem('token'); // Lấy token từ local storage hoặc nơi lưu trữ khác



const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const createReview = async (reviewData) => {
    const response = await axiosInstance.post('/reviews/', reviewData);
    return response.data;
  };

const getReviewsByDoctor = async (doctorId) => {
  const response = await axiosInstance.get(`/reviews/doctor/${doctorId}`);
  return response.data;
};

const getReviewsByDepartment = async (departmentId) => {
  const response = await axiosInstance.get(`/reviews/department/${departmentId}`);
  return response.data;
};

const getReviewByAppointment = async (appointmentId) => {
  const response = await axiosInstance.get(`/reviews/appointment/${appointmentId}`);
  return response.data;
};

const updateReview = async (id, reviewData) => {
  const response = await axiosInstance.put(`/reviews/${id}`, reviewData);
  return response.data;
};

const deleteReview = async (id) => {
  const response = await axiosInstance.delete(`/reviews/${id}`);
  return response.data;
};

const getTopRatedDoctors = async () => {
  const response = await axiosInstance.get('/reviews/top-rated-doctors');
  return response.data;
};


export default {
  createReview,
  getReviewsByDoctor,
  getReviewsByDepartment,
  updateReview,
  deleteReview,
  getReviewByAppointment,
  getTopRatedDoctors
};
