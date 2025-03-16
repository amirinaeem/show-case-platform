import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` // Append file extension
    );
  },
});

// File type validation
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|mp4|mov|webm|mkv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error('Only images (jpg, jpeg, png) and videos (mp4, mov, webm, mkv) are allowed.')); // Reject the file
  }
}

// Initialize Multer with storage and file filter
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Handle single file upload
router.post('/:fileType', upload.single('file'), (req, res) => {
  console.log('Request file:', req.file); // Log the uploaded file
  console.log('Request body:', req.body); // Log the request body
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/${req.file.path.replace(/\\/g, '/')}`; // Format file path

    res.status(200).json({
      message: 'File uploaded successfully',
      [req.params.fileType]: filePath, // Return the file path based on fileType
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'File upload failed' });
  }
});

export default router;