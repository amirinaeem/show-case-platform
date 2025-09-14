import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use absolute path for uploads directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const uploadsDir = path.join(__dirname, '../uploads');
const tempDir = path.join(__dirname, '../temp_uploads');

// Ensure directories exist
[uploadsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage for avatar uploads (goes to permanent uploads directory)
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage for temporary files
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    // Videos
    '.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv', '.mpeg',
    // Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt',
    // Archives
    '.zip', '.rar', '.7z', '.tar', '.gz',
    // Code files
    '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.php', '.rb', 
    '.go', '.rs', '.sh', '.html', '.css', '.scss', '.less', 
    '.json', '.md', '.yml', '.yaml', '.xml'
  ];
  
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not allowed`), false);
  }
};

// Multer instance for avatars (permanent storage)
export const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for avatars
  }
});

// Multer instance for temporary files
export const tempUpload = multer({
  storage: tempStorage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5
  }
});

// Simplified exports
export const uploadSingle = tempUpload.single.bind(tempUpload);
export const uploadMultiple = tempUpload.array.bind(tempUpload);
export const uploadAvatar = avatarUpload.single.bind(avatarUpload);