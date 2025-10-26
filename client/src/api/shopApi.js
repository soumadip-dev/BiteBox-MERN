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

//* Create shop
export const createEditShop = async function (shopData) {
  try {
    const response = await axiosInstance.post('/api/v1/shop/create-edit', shopData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type
      },
    });
    return response.data;
  } catch (error) {
    console.log('API Error:', error.message);
    console.log('Error response:', error.response?.data);

    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
