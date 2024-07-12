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

const roomService = {
  // Tạo phòng mới
  createRoom: async (roomData) => {
    try {
        console.log(roomData);
      const response = await axiosInstance.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Lấy phòng theo ID
  getRoomById: async (id) => {
    console.log(id);
    try {
      const response = await axiosInstance.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Cập nhật phòng
  updateRoom: async (id, roomData) => {
    try {
      const response = await axiosInstance.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Xóa phòng
  deleteRoom: async (id) => {
    try {
      const response = await axiosInstance.delete(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
};

export default roomService;