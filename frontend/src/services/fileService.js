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

const fileService = {
  // Lấy tất cả các file
  getAllFiles: async () => {
    try {
      const response = await axiosInstance.get('/files');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Thêm file mới
  addFile: async (fileData) => {
    try {
        console.log(fileData);
      const response = await axiosInstance.post('/files', fileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Cập nhật file
  updateFile: async (id, fileData) => {
    try {
      const response = await axiosInstance.put(`/files/${id}`, fileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Xóa file
  deleteFile: async (id) => {
    try {
      const response = await axiosInstance.delete(`/files/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
};

export default fileService;
