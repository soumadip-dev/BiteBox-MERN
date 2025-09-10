import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.config.js';

// create token
function generateToken(payload) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
}

// verify token
function verifyToken(token) {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (err) {
    return null; // invalid or expired
  }
}

export { generateToken, verifyToken };
