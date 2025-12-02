import {
  getCurrentUserDetailsService,
  updateUserLocationService,
} from '../services/user.service.js';

//* Controller to fetch current user
const getCurrentUser = async (req, res) => {
  try {
    // Get userId from request (set by auth middleware)
    const userId = req.userId;

    // Fetch user details from service
    const user = await getCurrentUserDetailsService(userId);

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    // Send error response
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};

//* Controller to update user location
const updateUserLocation = async (req, res) => {
  try {
    const userId = req.userId;
    const { latitude, longitude } = req.body;

    // Update user location in service
    await updateUserLocationService(userId, latitude, longitude);

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'User location updated successfully',
    });
  } catch (error) {
    // Send error response
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};

export { getCurrentUser, updateUserLocation };
