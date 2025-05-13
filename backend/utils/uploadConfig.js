// utils/uploadConfig.js
import path from 'path';
import fs from 'fs';

export const UPLOAD_CONFIG = {
  APP_UPLOADS: {
    dir: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileTypes: /jpg|jpeg|png|mp4|mov|webm|mkv/
  },
  MESSAGING_UPLOADS: {
    dir: 'messagingUploads/',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileTypes: /jpe?g|png|gif|mp4|mov|avi|pdf|docx?|txt|mp3|wav/
  }
};

// Ensure directories exist
Object.values(UPLOAD_CONFIG).forEach(config => {
  if (!fs.existsSync(config.dir)) {
    fs.mkdirSync(config.dir, { recursive: true });
  }
});