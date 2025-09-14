import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetEmail,
  verifyPasswordResetOtp,
  resetPassword,
  googleAuth,
} from '../controller/user.controller.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-otp', sendPasswordResetEmail);
router.post('/verify-otp', verifyPasswordResetOtp);
router.post('/reset-password', resetPassword);
router.post('/auth-route', googleAuth);

//* Export the router
export default router;
