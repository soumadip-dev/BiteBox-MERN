import User from '../model/user.model.js';

//* Service for getting current user
const getCurrentUserDetailsService = async userId => {
  // Throw error if no userId is provided
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Find user by ID
  const user = await User.findById(userId);

  // Throw error if user not found
  if (!user) {
    throw new Error('User not found');
  }

  // Return user details
  return user;
};

export { getCurrentUserDetailsService };
