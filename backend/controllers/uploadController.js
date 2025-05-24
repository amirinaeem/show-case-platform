import cloudinary from '../config/cloudinary.js';

// Common helper function
const uploadToCloudinary = async (filePath, folder) => {
  return cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto', // handles both image and video
  });
};

const uploadAppImage = async (req, res, next) => {
  try {
    const result = await uploadToCloudinary(req.file.path, 'appimage');
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};

const uploadAppVideo = async (req, res, next) => {
  try {
    const result = await uploadToCloudinary(req.file.path, 'appvideo');
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};

const uploadMessagingFile = async (req, res, next) => {
  try {
    const result = await uploadToCloudinary(req.file.path, 'messagingfiles');
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const result = await uploadToCloudinary(req.file.path, 'avatar');
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};



export { uploadAppImage, uploadAppVideo, uploadAvatar, uploadMessagingFile }
