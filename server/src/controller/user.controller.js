import {
  registerService,
  loginService,
  sendPasswordResetEmailService,
} from '../services/user.service.js';
import { ENV } from '../config/env.config.js';
import { transporter, generateEmail } from '../config/email.config.js';

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
    const emailContent = generateEmail({
      name: user.fullName,
      intro: 'You have requested to reset your password.',
      action: {
        instructions: 'Please use the following OTP to reset your password:',
        button: {
          color: '#DC4D2F',
          text: otp,
          link: '#',
          fallback: true,
        },
      },
      outro: 'If you did not request this reset, please ignore this email.',
    });

    const mailOptions = {
      from: `${ENV.COMPANY_NAME} <${ENV.BREVO_SENDEREMAIL}>`,
      to: email,
      subject: 'Password Reset Request',
      html: emailContent.html,
      text: emailContent.text,
    };
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

export { registerUser, loginUser, logoutUser, sendPasswordResetEmail };
