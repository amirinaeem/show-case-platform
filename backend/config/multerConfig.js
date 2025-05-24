import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = './temp_uploads';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png|gif|mp4|mov|webm|mkv|pdf|docx|txt/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (filetypes.test(ext)) cb(null, true);
  else cb(new Error('Invalid file type'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});
