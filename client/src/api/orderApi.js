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

//* Verify payment
export const verifyPayment = async function (orderId, razorpayPaymentId) {
  try {
    const response = await axiosInstance.post('/api/v1/order/verify-payment', {
      orderId,
      razorpayPaymentId,
    });
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

//* Get delivery boy assignment
export const getDeliveryBoyAssignment = async function () {
  try {
    const response = await axiosInstance.get('/api/v1/order/get-delivery-boy-assignment');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Accept order
export const acceptTheOrder = async function (assignmentId) {
  try {
    const response = await axiosInstance.put(`/api/v1/order/accept-order/${assignmentId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Get current order
export const getTheCurrentOrder = async function () {
  try {
    const response = await axiosInstance.get('/api/v1/order/get-current-order');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Get order by id
export const getOrderById = async function (orderId) {
  try {
    const response = await axiosInstance.get(`/api/v1/order/get-order-by-id/${orderId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Send delivery boy OTP
export const sendDeliveryBoyOtp = async function (orderId, shopOrderId) {
  try {
    const response = await axiosInstance.post('/api/v1/order/send-otp', { orderId, shopOrderId });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Verify delivery boy OTP
export const verifyDeliveryBoyOtp = async function (orderId, shopOrderId, otp) {
  try {
    const response = await axiosInstance.post('/api/v1/order/verify-otp', {
      orderId,
      shopOrderId,
      otp,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
