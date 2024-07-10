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

const doctorService = {
  // Lấy danh sách tất cả Doctors
  getAllDoctors: async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Lấy Doctor theo ID
  getDoctorById: async (id) => {
    try {
      const response = await axiosInstance.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Thêm Doctor
  addDoctor: async (doctorData) => {
    try {
      const response = await axiosInstance.post('/doctors', doctorData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Sửa Doctor
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await axiosInstance.put(`/doctors/${id}`, doctorData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  updateActiveDoctor: async (id, isActive) => {
    try {
      const response = await axiosInstance.put(`/doctors/active/${id}`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`Error updating active status of user with id ${id}:`, error);
      throw error;
    }
  },

  // Xóa Doctor
  deleteDoctor: async (id) => {
    try {
      const response = await axiosInstance.delete(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Lấy danh sách Doctors theo departmentId và tính sẵn sàng (availability)
  getDoctorsWithAvailability: async (departmentId, date, time) => {
    try {
        console.log(departmentId);
      const response = await axiosInstance.get(`/doctors/department/${departmentId}/availability`, {
        params: {
          date,
          time
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
};

export default doctorService;
