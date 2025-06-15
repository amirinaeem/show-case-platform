// uploadController.js - Updated Version

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

// Base upload handler
const handleUpload = async (file, resourceType, activeUploads) => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const filePath = file.path;
  activeUploads.add(filePath); // Mark file as being processed

  try {
    const result = await uploadToCloudinary(filePath, resourceType);
    return result;
  } finally {
    activeUploads.delete(filePath); // Remove from tracking when done
    await cleanupFile(filePath, activeUploads);
  }
};

// Controllers using the shared handler
const uploadAppImage = asyncHandler(async (req, res, next) => {
  const result = await handleUpload(req.file, 'appimage', req.app.locals.activeUploads);
  res.json({ url: result.secure_url, public_id: result.public_id });
});

const uploadAppVideo = asyncHandler(async (req, res, next) => {
  const result = await handleUpload(req.file, 'appvideo', req.app.locals.activeUploads);
  res.json({ 
    url: result.secure_url,
    public_id: result.public_id,
    duration: result.duration,
    format: result.format
  });
});

const uploadMessagingFile = asyncHandler(async (req, res, next) => {
  const result = await handleUpload(req.file, 'messagingfiles', req.app.locals.activeUploads);
  res.json({ url: result.secure_url, public_id: result.public_id });
});

const uploadAvatar = asyncHandler(async (req, res, next) => {
  const result = await handleUpload(req.file, 'avatars', req.app.locals.activeUploads);
  res.json({ url: result.secure_url, public_id: result.public_id });
});

const uploadMessengerImages = asyncHandler(async (req, res, next) => {
  const result = await handleUpload(req.file, 'messenger-Images', req.app.locals.activeUploads);
  res.json({ url: result.secure_url, public_id: result.public_id });
});

export { 
  uploadAppImage, 
  uploadAppVideo, 
  uploadAvatar, 
  uploadMessagingFile, 
  uploadMessengerImages 
};