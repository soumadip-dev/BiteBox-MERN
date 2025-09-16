import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetEmail,
  verifyPasswordResetOtp,
  resetPassword,
  googleAuth,
} from '../controller/auth.controller.js';
import { isAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuth, logoutUser);
router.post('/send-otp', sendPasswordResetEmail);
router.post('/verify-otp', verifyPasswordResetOtp);
router.post('/reset-password', resetPassword);
router.post('/google-auth', googleAuth);

//* Export the router
export default router;
