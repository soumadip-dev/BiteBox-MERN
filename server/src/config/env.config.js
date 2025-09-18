import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  BACKEND_URL: process.env.BACKEND_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BREVO_HOST: process.env.BREVO_HOST,
  BREVO_PORT: process.env.BREVO_PORT,
  BREVO_USERNAME: process.env.BREVO_USERNAME,
  BREVO_PASSWORD: process.env.BREVO_PASSWORD,
  BREVO_SENDEREMAIL: process.env.BREVO_SENDEREMAIL,
};
