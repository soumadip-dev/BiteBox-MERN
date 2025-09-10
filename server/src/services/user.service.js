import User from '../model/user.model.js';
import { isStrongPassword, isValidEmail, isValidMobile } from '../utils/validation.utils.js';
import { generateToken } from '../utils/jwt.utils.js';

//* Service for registering a user
const registerService = async (fullName, email, password, mobile, role) => {
  // Check if all fields are provided
  if (!fullName || !email || !password) {
    throw new Error('All fields are required');
  }

  // Check if email is valid
  if (!isValidEmail(email)) {
    throw new Error('Email is not valid');
  }

  // Check if password is strong enough
  if (!isStrongPassword(password)) {
    throw new Error('Password is not strong enough');
  }

  // Check if mobile number is valid
  if (!isValidMobile(mobile)) {
    throw new Error('Mobile number is not valid');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const newUser = await User.create({ fullName, email, role, mobile, password });

  // Generate JWT token

  if (!newUser) {
    throw new Error('User creation failed');
  }

  // Generate JWT token
  const token = generateToken({ id: newUser._id });

  const user = await User.findById(newUser._id).select('-password');

  return { user, token };
};

export { registerService };
