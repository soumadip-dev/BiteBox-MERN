import axiosInstance from '../utils/axiosInstance';

//* Get current user
export const getMyShop = async function () {
  try {
    const response = await axiosInstance.get('/api/v1/shop/get-my');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
