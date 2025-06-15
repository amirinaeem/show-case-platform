import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = './temp_uploads';

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png|gif|mp4|mov|webm|mkv|pdf|docx|txt/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (filetypes.test(ext)) cb(null, true);
  else cb(new Error('Invalid file type'));
};

export const multerInstance = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5
  }
});

// Simplified exports without cleanup middleware
export const uploadSingle = multerInstance.single.bind(multerInstance);
export const uploadMultiple = multerInstance.array.bind(multerInstance);