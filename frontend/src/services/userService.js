// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users';
const token = localStorage.getItem('token'); // Lấy token từ local storage hoặc nơi lưu trữ khác

// Add Axios instance for configuring common settings
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});

// Add a request interceptor to attach the token to each request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Assuming you store your token in localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

const UserService = {
    getAllUsers: async () => {
      try {
        const response = await axiosInstance.get('/');
        return response.data;
      } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
      }
    },
  
    getUserById: async (id) => {
      try {
        const response = await axiosInstance.get(`/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
      }
    },
  
    addUser: async (userData) => {
      try {
        const response = await axiosInstance.post('/', userData);
        return response.data;
      } catch (error) {
        console.error('Error adding user:', error);
        throw error;
      }
    },
  
    updateUser: async (id, userData) => {
      try {
        const response = await axiosInstance.put(`/${id}`, userData);
        return response.data;
      } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw error;
      }
    },
  
    updateActiveUser: async (id, isActive) => {
      try {
        const response = await axiosInstance.put(`/active/${id}`, { isActive });
        return response.data;
      } catch (error) {
        console.error(`Error updating active status of user with id ${id}:`, error);
        throw error;
      }
    },
  
    deleteUser: async (id) => {
      try {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
      }
    }
  };
  
  export default UserService;
