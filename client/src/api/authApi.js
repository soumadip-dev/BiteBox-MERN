import axiosInstance from '../utils/axiosInstance';

//* Register user
export const registerUser = async function (userData) {
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
export const loginUser = async function (userData) {
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

//* Send password reset email
export const sendPasswordResetEmail = async function (email) {
  try {
    const response = await axiosInstance.post('/api/v1/auth/send-otp', { email });
    return response.data; // { success: true/false, message: "..." }
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Verify OTP
export const verifyPasswordResetOtp = async function (userData) {
  try {
    const response = await axiosInstance.post('/api/v1/auth/verify-otp', userData);
    return response.data; // { success: true/false, message: "..." }
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Reset password
export const resetPassword = async function (userData) {
  try {
    const response = await axiosInstance.post('/api/v1/auth/reset-password', userData);
    return response.data; // { success: true/false, message: "..." }
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
