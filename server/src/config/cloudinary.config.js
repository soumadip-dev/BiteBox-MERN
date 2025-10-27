import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.config.js';
import fs from 'fs/promises';

//* Upload image on cloudinary
const uploadOnCloudinary = async file => {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
  });
  try {
    const { secure_url } = await cloudinary.uploader.upload(file);
    await fs.unlink(file);
    return secure_url;
  } catch (error) {
    await fs.unlink(file);
    console.log(error);
    throw error;
  }
};

export default uploadOnCloudinary;
