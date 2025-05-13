import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// File type validation
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|mp4|mov|webm|mkv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  
  const isMovFile = file.mimetype === 'video/quicktime' && 
  path.extname(file.originalname).toLowerCase() === '.mov';

  if (extname && (mimetype || isMovFile)) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpg, jpeg, png) and videos (mp4, mov, webm, mkv) are allowed.'));
  }
}

// Configure multer for temporary file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const tempDir = './temp_uploads';
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Determine resource type based on MIME type
    const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, {
      folder: 'app_uploads',
      resource_type: resourceType
    });

    // Clean up: delete the temporary file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: resourceType
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up temp file if upload failed
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file after failed upload:', err);
      });
    }

    res.status(500).json({ 
      error: 'File upload failed',
      message: error.message 
    });
  }
});

export default router;