// src/services/authService.js
import axios from 'axios';

// Set the base URL for the API
const API_URL = 'http://localhost:3001/api/auth';

// Register user
const register = async (name, phone, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    phone,
    email,
    password
  });
  return response.data;
};

// Login user
const login = async (phone, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    phone,
    password
  });
  return response.data;
};

// Change password
const changePassword = async (token, currentPassword, newPassword) => {
  const response = await axios.post(
    `${API_URL}/change-password`,
    {
      currentPassword,
      newPassword
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export default {
  register,
  login,
  changePassword
};
