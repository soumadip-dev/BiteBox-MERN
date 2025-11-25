import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.config.js';

//* Middleware to authenticate user requests
export const isAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const authToken = req.cookies?.token;

    // Return 401 if no token is provided
    if (!authToken) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify token using secret key
    const decoded = jwt.verify(authToken, ENV.JWT_SECRET);

    const userId = decoded.id;
    const userRole = decoded.role;

    // Attach userId to request if present
    if (userId) {
      req.userId = userId;
      req.userRole = userRole;
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized, please login again' });
    }

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
