import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Đổi lại URL của API của bạn nếu cần
const token = localStorage.getItem('token'); // Lấy token từ local storage hoặc nơi lưu trữ khác

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const appointmentService = {
    getAllAppointments: async () => {
        try {
          const response = await axiosInstance.get('/appointments');
          return response.data;
        } catch (error) {
          console.error('Error fetching appointments:', error.message);
          throw error;
        }
      },
    
      getAppointmentById: async (id) => {
        try {
          const response = await axiosInstance.get(`/appointments/${id}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching appointment:', error.message);
          throw error;
        }
      },
    
      addAppointment: async (appointmentData) => {
        try {
          const response = await axiosInstance.post('/appointments', appointmentData);
          return response.data;
        } catch (error) {
          console.error('Error adding appointment:', error.message);
          throw error;
        }
      },
    
      updateAppointment: async (id, appointmentData) => {
        try {
          const response = await axiosInstance.put(`/appointments/${id}`, appointmentData);
          return response.data;
        } catch (error) {
          console.error('Error updating appointment:', error.message);
          throw error;
        }
      },
    
      deleteAppointment: async (id) => {
        try {
          const response = await axiosInstance.delete(`/appointments/${id}`);
          return response.data;
        } catch (error) {
          console.error('Error deleting appointment:', error.message);
          throw error;
        }
      },
    
      getDoctorAppointmentsByDate: async (doctorId, date) => {
        try {
          const response = await axiosInstance.get(`/appointments/doctor/${doctorId}/times`, {
            params: { date }
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching doctor appointments:', error.message);
          throw error;
        }
      }
}
export default appointmentService;