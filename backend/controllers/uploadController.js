import { uploadToCloudinary } from '../utils/cloudinaryHelpers.js';
import asyncHandler from '../middleware/asyncHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const unlinkAsync = promisify(fs.unlink);

// Helper function for cleanup
const cleanupFile = async (filePath, activeUploads) => {
  try {
    if (filePath && fs.existsSync(filePath) && !activeUploads.has(filePath)) {
      await unlinkAsync(filePath);
      console.log(`Controller cleanup: Removed ${filePath}`);
    }
  } catch (err) {
    console.error('Controller cleanup error:', err);
  }
};

// Individual controllers with direct Cloudinary upload
const uploadAppImage = asyncHandler(async (req, res, next) => {
  if (!req.file) throw new Error('No file uploaded');
  
  const filePath = req.file.path;
  req.app.locals.activeUploads.add(filePath);

  try {
    const result = await uploadToCloudinary(filePath, 'appimage');
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  } finally {
    req.app.locals.activeUploads.delete(filePath);
    await cleanupFile(filePath, req.app.locals.activeUploads);
  }
});

const uploadAppVideo = asyncHandler(async (req, res, next) => {
  if (!req.file) throw new Error('No file uploaded');
  
  const filePath = req.file.path;
  req.app.locals.activeUploads.add(filePath);

  try {
    const result = await uploadToCloudinary(filePath, 'appvideo');
    res.json({ 
      url: result.secure_url,
      public_id: result.public_id,
      duration: result.duration,
      format: result.format
    });
  } catch (error) {
    throw new Error(`Video upload failed: ${error.message}`);
  } finally {
    req.app.locals.activeUploads.delete(filePath);
    await cleanupFile(filePath, req.app.locals.activeUploads);
  }
});

const uploadMessengerFiles = asyncHandler(async (req, res, next) => {
  if (!req.file) throw new Error('No file uploaded');
  
  const filePath = req.file.path;
  req.app.locals.activeUploads.add(filePath);

  try {
    const result = await uploadToCloudinary(filePath, 'messenger_Files');
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  } finally {
    req.app.locals.activeUploads.delete(filePath);
    await cleanupFile(filePath, req.app.locals.activeUploads);
  }
});

const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) throw new Error('No file uploaded');
  
  const filePath = req.file.path;
  req.app.locals.activeUploads.add(filePath);

  try {
    const result = await uploadToCloudinary(filePath, 'avatars');
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    throw new Error(`Avatar upload failed: ${error.message}`);
  } finally {
    req.app.locals.activeUploads.delete(filePath);
    await cleanupFile(filePath, req.app.locals.activeUploads);
  }
});

const uploadMessengerImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    throw new Error('No files uploaded');
  }

  const results = [];
  const uploadPromises = req.files.map(async (file) => {
    const filePath = file.path;
    req.app.locals.activeUploads.add(filePath);

    try {
      const result = await uploadToCloudinary(filePath, 'messenger_Images');
      results.push({
        url: result.secure_url,
        public_id: result.public_id,
        type: 'image',
        fileName: file.originalname,
        fileType: file.mimetype
      });


    } catch (err) {
      console.error(`Failed to upload ${file.originalname}:`, err);
    } finally {
      req.app.locals.activeUploads.delete(filePath);
      await cleanupFile(filePath, req.app.locals.activeUploads);
    }
  });

  await Promise.all(uploadPromises);

  if (results.length === 0) {
    throw new Error('All image uploads failed');
  }

  res.json(results);
});

export { 
  uploadAppImage, 
  uploadAppVideo, 
  uploadAvatar, 
  uploadMessengerFiles, 
  uploadMessengerImages 
};