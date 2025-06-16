// utils/downloadUtils.js
export const downloadFile = (url, fileName = '') => {
  // If this is a Cloudinary URL, add download parameter
  const downloadUrl = url.includes('res.cloudinary.com') 
    ? url.replace('/upload/', '/upload/fl_attachment/')
    : url;

  // Extract filename from URL if not provided
  let finalFilename = fileName;
  if (!finalFilename) {
    const urlParts = downloadUrl.split('/');
    finalFilename = urlParts[urlParts.length - 1].split('?')[0];
  }

  // Create temporary anchor element
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = finalFilename;
  anchor.style.display = 'none';
  
  // Trigger download
  document.body.appendChild(anchor);
  anchor.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(anchor);
    // For blob URLs, revoke after download
    if (downloadUrl.startsWith('blob:')) {
      URL.revokeObjectURL(downloadUrl);
    }
  }, 100);
};

export const handleTouchDownload = (url, fileName, setTouchTimer) => {
  const timer = setTimeout(() => {
    downloadFile(url, fileName);
  }, 1000); // 1 second long press
  setTouchTimer(timer);
};

export const cancelTouchDownload = (touchTimer, setTouchTimer) => {
  if (touchTimer) {
    clearTimeout(touchTimer);
    setTouchTimer(null);
  }
};