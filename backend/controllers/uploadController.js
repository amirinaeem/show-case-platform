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

const uploadAvatar = asyncHandler(async (req, res, next) => {

  if (!req.file) throw new Error('No file uploaded');

  console.log(req.file, 'from backend controllor')
  
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

// In your uploadController.js, enhance the video upload handler:
const uploadAppVideo = asyncHandler(async (req, res, next) => {
  if (!req.file) throw new Error('No file uploaded');
  
  const filePath = req.file.path;
  req.app.locals.activeUploads.add(filePath);

  try {
    const result = await uploadToCloudinary(filePath, 'appvideo');
    
    // Add proper response for frontend
    res.json({ 
      url: result.secure_url,
      public_id: result.public_id,
      duration: result.duration || 0, // Default if not available
      format: result.format,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error('Video upload error:', error);
    throw new Error(`Video upload failed: ${error.message}`);
  } finally {
    req.app.locals.activeUploads.delete(filePath);
    await cleanupFile(filePath, req.app.locals.activeUploads);
  }
});

const uploadMessengerFiles = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const results = [];
  const uploadPromises = req.files.map(async (file) => {
    const filePath = file.path;
    req.app.locals.activeUploads.add(filePath);

    try {
      const result = await uploadToCloudinary(filePath, 'messenger_Files');
      
      // Determine if this is a code file
      const isCodeFile = [
        'text/javascript', 'application/javascript', 
        'text/x-python', 'text/x-java', 'text/x-php',
        'text/html', 'text/css', 'text/x-c', 'text/x-c++',
        'text/x-ruby', 'text/x-go', 'text/x-rust',
        'text/x-shellscript'
      ].some(mime => file.mimetype.includes(mime));

      results.push({
        url: result.secure_url,
        public_id: result.public_id,
        type: isCodeFile ? 'code' : file.mimetype.split('/')[0],
        fileType: file.mimetype,
        fileName: file.originalname
      });
    } catch (err) {
      console.error(`Failed to upload ${file.originalname}:`, err);
      throw err;
    } finally {
      req.app.locals.activeUploads.delete(filePath);
      await cleanupFile(filePath, req.app.locals.activeUploads);
    }
  });

  try {
    await Promise.all(uploadPromises);
    res.json(results);
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      message: 'Some files failed to upload',
      error: error.message
    });
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