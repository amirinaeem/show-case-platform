import { useState, useCallback } from 'react';
import { Button, Image, Badge, CloseButton, Spinner } from 'react-bootstrap';
import { FaImage, FaPaperPlane, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../assets/styles/messaging/UploadImages.css'; // Create this CSS file for custom styles

const UploadImages = () => {
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast.warning('Please select only image files');
      return;
    }

    const newAttachments = files.map(file => ({
      type: 'image',
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatFileSize(file.size),
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadImages = async () => {
    if (attachments.length === 0) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      attachments.forEach(att => formData.append('images', att.file));
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      toast.success('Images uploaded successfully!');
      setAttachments([]);
    } catch (error) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <Button variant="link" className="upload-icon-button p-4">
        <label htmlFor="image-upload-input" className="cursor-pointer d-flex align-items-center">
          <FaImage size={20} className="upload-icon" />
          
        </label>
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="d-none"
        />
      </Button>

      {attachments.length > 0 && (
        <div className="attachments-preview mt-2">
          <div className="preview-title mb-2">
            <strong>{attachments.length} image{attachments.length > 1 ? 's' : ''} selected</strong>
          </div>
          
          <div className="image-previews-container">
            {attachments.map((attachment, index) => (
              <div key={index} className="image-attachment-item">
                <div className="image-preview-wrapper">
                  <Image 
                    src={attachment.preview} 
                    thumbnail 
                    className="preview-image"
                  />
                  <div className="image-info-overlay">
                    <span className="image-name">{attachment.name}</span>
                    <Badge bg="light" text="dark" className="image-size-badge">
                      {attachment.size}
                    </Badge>
                  </div>
                </div>
                <CloseButton 
                  onClick={() => removeAttachment(index)} 
                  className="remove-image-btn"
                />
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={uploadImages}
            disabled={isUploading}
            className="w-100 mt-2 d-flex align-items-center justify-content-center"
          >
            {isUploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              <>
                <FaPaperPlane className="me-2" />
                Send {attachments.length > 1 ? 'Images' : 'Image'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadImages;