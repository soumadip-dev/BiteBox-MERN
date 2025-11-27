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

//* Update order status
export const updateOrderStatus = async function (orderId, shopId, status) {
  try {
    const response = await axiosInstance.put(
      `/api/v1/order/update-order-status/${orderId}/${shopId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
