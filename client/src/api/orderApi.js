import axiosInstance from '../utils/axiosInstance';

//* Register user
export const placeOrder = async function (orderData) {
  try {
    const response = await axiosInstance.post('/api/v1/order/place-order', orderData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Get orders
export const getOrders = async function () {
  try {
    const response = await axiosInstance.get('/api/v1/order/get-orders');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
