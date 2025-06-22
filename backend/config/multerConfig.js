import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = '../server/temp_uploads';

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
  // Allow all file types but with size limits
  const allowedExtensions = [
    // Video formats
  '.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv', '.mpeg',
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
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