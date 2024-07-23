import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Đổi lại URL của API của bạn
const token = localStorage.getItem('token'); // Lấy token từ local storage hoặc nơi lưu trữ khác

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const departmentService = {
  // Lấy danh sách tất cả Departments
  getAllDepartments: async () => {
    try {
      const response = await axiosInstance.get('/departments');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Lấy Department theo ID
  getDepartmentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Thêm Department
  addDepartment: async (name, description) => {
    try {
      const response = await axiosInstance.post('/departments', { name, description });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Sửa Department
  updateDepartment: async (id, name, description) => {
    console.log(name,id,description);
    try {
      const response = await axiosInstance.put(`/departments/${id}`, { name, description });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Xóa Department
  deleteDepartment: async (id) => {
    try {
      const response = await axiosInstance.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  updateDepartmentIsActive: async (id, isActive) => {
    try {
      const response = await axiosInstance.put(`/departments/${id}/active`, { isActive });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
};

export default departmentService;