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

//* Create or edit shop
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

//* Add food item in shop
export const addFoodItem = async function (foodData) {
  try {
    const response = await axiosInstance.post('/api/v1/item/add-item', foodData, {
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

//* Edit food item
export const editFoodItem = async function (itemId, foodData) {
  try {
    const response = await axiosInstance.post(`/api/v1/item/edit-item/${itemId}`, foodData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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

//* Get food item by ID
export const getFoodItemById = async function (itemId) {
  try {
    const response = await axiosInstance.get(`/api/v1/item/get-by-id/${itemId}`);
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

//* Delete food item
export const deleteFoodItem = async function (itemId) {
  try {
    const response = await axiosInstance.delete(`/api/v1/item/delete-item/${itemId}`);
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

//* Get all shop by city
export const getShopByCity = async function (city) {
  try {
    const response = await axiosInstance.get(`/api/v1/shop/get-by-city/${city}`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Get all shop by city
export const getItemByCity = async function (city) {
  try {
    const response = await axiosInstance.get(`/api/v1/item/get-by-city/${city}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Get items by restaurant
export const getItemByRestaurant = async function (restaurantId) {
  try {
    const response = await axiosInstance.get(`/api/v1/item/get-by-restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};

//* Search items
export const searchItems = async function (query, city) {
  try {
    const response = await axiosInstance.get(
      `/api/v1/item/search-items?query=${query}&city=${city}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Network error occurred' };
  }
};
