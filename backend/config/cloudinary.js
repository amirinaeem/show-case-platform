import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add this helper function
export const uploadToCloudinary = async (filePath, options = {}) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: options.folder || 'uploads',
    resource_type: options.resource_type || 'auto',
  });
};

export default cloudinary;
