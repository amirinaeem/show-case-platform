import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` 
    );
  },
});

// File type validation
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|mp4|mov|webm|mkv/; 
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  
  const isMovFile = file.mimetype === 'video/quicktime' && path.extname(file.originalname).toLowerCase() === '.mov';

  if (extname && (mimetype || isMovFile)) {
    return cb(null, true); 
  } else {
    cb(new Error('Only images (jpg, jpeg, png) and videos (mp4, mov, webm, mkv) are allowed.')); 
  }
}


const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 100 * 1024 * 1024 }, 
});


router.post('/:fileType', upload.single('file'), (req, res) => {
  console.log('Request file:', req.file); 
  console.log('Request body:', req.body); 

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/${req.file.path.replace(/\\/g, '/')}`; 

    res.status(200).json({
      message: 'File uploaded successfully',
      [req.params.fileType]: filePath, 
    });
  } catch (error) {
    console.error('File upload error:', error); 
    res.status(500).json({ error: error.message || 'File upload failed' });
  }
});

export default router;