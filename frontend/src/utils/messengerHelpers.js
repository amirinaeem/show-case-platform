// src/utils/messengerHelpers.js
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const prepareAttachments = (files) => {
  return Array.from(files).map(file => ({
    type: file.type.startsWith('image/') ? 'image' : 'file',
    file,
    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    name: file.name,
    size: formatFileSize(file.size)
  }));
};

export const cleanupAttachments = (attachments) => {
  attachments.forEach(attachment => {
    if (attachment?.preview) {
      URL.revokeObjectURL(attachment.preview);
    }
  });
};
