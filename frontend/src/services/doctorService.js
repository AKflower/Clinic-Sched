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
  updateDayOff: async (id, dayOff, reason) => {
    const response = await axiosInstance.post(`/doctors/${id}/dayOff`, {dayOff,reason});
    return response.data;
  },
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
  },
  getWorkingDaysByMonth: async (doctorId, month, year) => {
    try {
      const response = await axiosInstance.get(`/doctors/wdbm/${doctorId}?year=${year}&month=${month}`, {
        // params: {
        //   month,
        //   year,
        // },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getWorkingDoctor: async (date) => {

    const queryDate = new Date(date);
    queryDate.setDate(queryDate.getDate() + 1);
    queryDate.setUTCHours(0, 0, 0, 0);
  
    

 
    const timestamp = queryDate.toISOString();
    console.log(timestamp);
    try {
      const response = await axiosInstance.get(`doctors/${timestamp}/working`, {
       
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching working doctors:', error);
      throw error;
    }
  },
  updatePassword: async (id, password) => {
    try {
      const response = await axiosInstance.put(`/doctors/changePass/${id}`, { password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  deleteDayOff: async (doctorId, date) => {
    try {
      // Cộng thêm 1 ngày vào ngày cần xóa
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);

      // Định dạng lại ngày sau khi cộng thêm 1 ngày
      const formattedDate = newDate.toISOString().split('T')[0];

      const response = await axiosInstance.delete(`/doctors/doctor/${doctorId}/dayOff`, { data: { date: formattedDate } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default doctorService;
