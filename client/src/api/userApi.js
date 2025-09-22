import axiosInstance from '../utils/axiosInstance';

//* Get current user
export const getCurrentUser = async function () {
  try {
    const response = await axiosInstance.get('/api/v1/user/current');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
