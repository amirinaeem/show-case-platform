import { uploadToCloudinary } from '../utils/cloudinaryHelpers.js';
import asyncHandler from '../middleware/asyncHandler.js';

const uploadAppImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const result = await uploadToCloudinary(req.file.path, 'appimage');
  res.json({ 
    url: result.secure_url,
    public_id: result.public_id 
  });
});

const uploadAppVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const result = await uploadToCloudinary(req.file.path, 'appvideo');
  res.json({ 
    url: result.secure_url,
    public_id: result.public_id,
    duration: result.duration,
    format: result.format
  });
});

const uploadMessagingFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const result = await uploadToCloudinary(req.file.path, 'messagingfiles');
  res.json({ 
    url: result.secure_url,
    public_id: result.public_id
  });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const result = await uploadToCloudinary(req.file.path, 'avatars');
  res.json({ 
    url: result.secure_url,
    public_id: result.public_id
  });
});

export { uploadAppImage, uploadAppVideo, uploadAvatar, uploadMessagingFile };