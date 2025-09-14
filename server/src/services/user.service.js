import User from '../model/user.model.js';
import { isStrongPassword, isValidEmail, isValidMobile } from '../utils/validation.utils.js';
import { generateToken } from '../utils/jwt.utils.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

//* Service for registering a user
const registerService = async function (fullName, email, password, mobile, role) {
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
  const token = await generateToken({ id: newUser._id });

  // Get user without password
  const user = await User.findById(newUser._id).select('-password');

  return { user, token };
};

//* Service for logging in a user
const loginService = async function (email, password) {
  // Check if email and password are provided
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Find the user based on email
  const loggedInuser = await User.findOne({ email });

  // Chelck if user exists or not
  if (!loggedInuser) {
    throw new Error('Invalid Credentials');
  }

  // Check if password is correct
  const isPassewordCorrect = await bcrypt.compare(password, loggedInuser.password);
  if (!isPassewordCorrect) {
    throw new Error('Invalid Credentials');
  }

  // Generate JWT token
  const token = await generateToken({ id: loggedInuser._id });

  // Get user without password
  const user = await User.findById(loggedInuser._id).select('-password');

  // Return user and token
  return { user, token };
};

//* Service for sending password reset email to the user's email
const sendPasswordResetEmailService = async function (email) {
  // Chek if email is provided
  if (!email) {
    throw new Error('Email is required');
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Generate OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  // update user resetPasswordOtp and resetPasswordOtpExpiry
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

  // Update isOtpVerified
  user.isOtpVerified = false;

  // Save the updated user
  await user.save();

  return { user, otp };
};

//* Service for verifying password reset otp
const verifyPasswordResetOtpService = async function (email, otp) {
  // Check if email and OTP are provided
  if (!email || !otp) {
    throw new Error('Email, OTP, and new password must be provided');
  }
  // Find user based on email
  const user = await User.findOne({ email });

  // Check if the user exists or not
  if (!user) {
    throw new Error('User not found');
  }
  // Check if provided OTP is valid and not expired
  if (
    user.resetPasswordOtp === '' ||
    user.resetPasswordOtp !== otp ||
    user.resetPasswordOtpExpiry < Date.now()
  ) {
    throw new Error('Invalid or expired OTP');
  }
  // set isOtpVerified to true
  user.isOtpVerified = true;

  // set resetPasswordOtp to undefined because it has been used
  user.resetPasswordOtp = undefined;

  // set resetPasswordOtpExpiry to undefined because it has been used
  user.resetPasswordOtpExpiry = undefined;

  // Save the updated user
  await user.save();
};

//* Service for resetting password
const resetPasswordService = async function (email, newPassword) {
  // Check if email and new password are provided
  if (!email || !newPassword) {
    throw new Error('Email and new password are required');
  }

  // Find user based on email
  const user = await User.findOne({ email });

  // Check if the user exists or not
  if (!user) {
    throw new Error('User not found');
  }

  // Check if the user has been verified or not
  if (!user.isOtpVerified) {
    throw new Error('OTP verification required');
  }

  // Check if password is strong enough or not
  if (!isStrongPassword(newPassword)) {
    throw new Error('Password is not strong enough');
  }

  // Check if password is same as previous
  const isPasswordSame = await bcrypt.compare(newPassword, user.password);
  if (isPasswordSame) {
    throw new Error('Password is same as previous');
  }

  // Change the password
  user.password = newPassword;

  // set isOtpVerified to false
  user.isOtpVerified = false;

  // Save the user
  await user.save();
};

//* Service for Google authentication
const googleAuthService = async function (fullName, email, mobile) {
  // Check if email is provided
  if (!email) {
    throw new Error('Email is required');
  }
  // Check if user already exists
  let user = await User.findOne({ email });

  // If user does not exist, create a new user
  if (!user) {
    if (!isValidMobile(mobile)) {
      throw new Error('Mobile number is not valid');
    }
    const randomPassword = crypto.randomBytes(10).toString('hex');
    user = await User.create({
      fullName,
      email,
      mobile,
      role: 'user',
      password: randomPassword,
    });
  }

  const token = await generateToken({ id: user._id });

  const responseUser = await User.findById(user._id).select('-password');

  return { user: responseUser, token };
};

//* Export services
export {
  registerService,
  loginService,
  sendPasswordResetEmailService,
  verifyPasswordResetOtpService,
  resetPasswordService,
  googleAuthService,
};
