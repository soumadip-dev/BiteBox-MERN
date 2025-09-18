import axiosInstance from '../utils/axiosInstance';

//* Register user
export const registerUser = async userData => {
  try {
    const response = await axiosInstance.post('/api/v1/auth/register', userData);
    return response.data; // { success: true/false, message: "..." }
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Login user
export const loginUser = async userData => {
  try {
    const response = await axiosInstance.post('/api/v1/auth/login', userData);
    return response.data; // { success: true/false, message: "..." }
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
