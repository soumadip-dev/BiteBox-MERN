import { registerService } from '../services/user.service.js';
import { ENV } from '../config/env.config.js';

//* Controller for registering a user
const registerUser = async (req, res) => {
  // Get fields from request body
  const { fullName, email, password, mobile, role } = req.body;

  try {
    // Get the user and token from registerService
    const { user, token } = await registerService(fullName, email, password, mobile, role);

    // Store JWT token in cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('token', token, cookieOptions);

    // Send success response
    res.status(201).json({
      user: user,
      message: 'User registered successfully',
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

export { registerUser };
