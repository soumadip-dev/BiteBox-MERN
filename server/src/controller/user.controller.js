import {
  registerService,
  loginService,
  sendPasswordResetEmailService,
  verifyPasswordResetOtpService,
  resetPasswordService,
} from '../services/user.service.js';
import { ENV } from '../config/env.config.js';
import transporter from '../config/nodemailer.config.js';
import generateMailOptions from '../utils/mailTemplates.utils.js';

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

//* Controller for logging in a user
const loginUser = async function (req, res) {
  // Get fields from request body
  const { email, password } = req.body;

  try {
    // Get the user and token from loginService
    const { user, token } = await loginService(email, password);

    // Store JWT token in cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('token', token, cookieOptions);

    // Send success response
    return res.status(200).json({
      user: user,
      message: 'User logged in successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller for logout
const logoutUser = async function (req, res) {
  try {
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
    });

    // return success message
    return res.status(200).json({ message: 'User logged out successfully', success: true });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to send password reset email to the user's email
const sendPasswordResetEmail = async function (req, res) {
  // Get email from request body
  const { email } = req.body;
  try {
    // Get the user and otp from sendPasswordResetEmailService
    const { user, otp } = await sendPasswordResetEmailService(email);

    // Send password reset email to user
    const mailOptions = generateMailOptions({
      user,
      otp,
      type: 'forgetPassword',
      companyName: ENV.COMPANY_NAME,
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      return res
        .status(500)
        .json({ message: emailError.message || 'Email sending failed', success: false });
    }
    // Send success response
    return res.status(200).json({
      message: 'Password reset email sent successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller to verify password reset otp
const verifyPasswordResetOtp = async function (req, res) {
  // Get email and otp from request body
  const { email, otp } = req.body;

  try {
    // verify password reset otp using verifyPasswordResetOtpService
    await verifyPasswordResetOtpService(email, otp);

    // Send success response
    return res.status(200).json({
      message: 'Password reset OTP verified successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller to reset password
const resetPassword = async function (req, res) {
  // Get email and new password from request body
  const { email, newPassword } = req.body;

  try {
    // reset password using resetPasswordService
    await resetPasswordService(email, newPassword);

    // Send success response
    return res.status(200).json({
      message: 'Password reset successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Export controllers
export { registerUser, loginUser, logoutUser, sendPasswordResetEmail, verifyPasswordResetOtp };
