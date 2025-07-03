import { useState } from 'react';
import { Button, Image, Badge, Spinner } from 'react-bootstrap';
import { FaImage, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSendMessageMutation } from '../../slices/messengerSlice';
import '../../assets/styles/messaging/upload.css';

const UploadImages = ({ selectFriend }) => {
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (!files.length) {
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

  const uploadImagesHandler = async () => {
    if (!attachments.length || !selectFriend?._id) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      attachments.forEach(att => formData.append('files', att.file));

      const uploadResponse = await fetch('/api/uploads/images', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'File upload failed');
      }

      const uploadedFiles = await uploadResponse.json();

      await sendMessage({
        receiverId: selectFriend._id,
        files: uploadedFiles.map(file => ({
          url: file.url,
          type: file.type || 'image',
          fileType: file.fileType || file.mimetype,
          fileName: file.fileName || file.originalname,
          public_id: file.public_id
        })),
        text: '',
      }).unwrap();

      toast.success('Images sent successfully!');
      setAttachments([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.data?.message || error.message || 'Failed to send images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <Button variant="link" className="upload-btn" aria-label="Upload images">
        <label htmlFor="image-upload-input" className="cursor-pointer d-flex align-items-center">
          <FaImage className="upload-icon" />
        </label>
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="d-none"
          aria-label="Select images to upload"
        />
      </Button>

      {attachments.length > 0 && (
        <div className="upload-preview-container">
          <div className="preview-header">
            <strong>
              {attachments.length} image{attachments.length !== 1 ? 's' : ''} selected
            </strong>
          </div>
          
          <div className="upload-items-container">
  <div className="upload-items-list">
    {attachments.map((attachment, index) => (
      <div key={`${attachment.name}-${index}`} className="position-relative">
        <div className="image-preview-wrapper">
          <Image 
            src={attachment.preview} 
            thumbnail 
            className="preview-image"
            alt={`Preview of ${attachment.name}`}
          />
          <div className="image-info-overlay">
            <span className="image-name">{attachment.name}</span>
            <Badge bg="light" text="dark" className="image-size-badge">
              {attachment.size}
            </Badge>
          </div>
        </div>
        <button
          onClick={() => removeAttachment(index)}
          className="position-absolute top-0 end-0 m-2 bg-white rounded-circle border-0"
          style={{width: '24px', height: '24px'}}
          aria-label={`Remove ${attachment.name}`}
        >
          &times;
        </button>
      </div>
    ))}
  </div>
</div>

          <Button
            variant="primary"
            size="sm"
            onClick={uploadImagesHandler}
            disabled={isUploading}
            className="upload-send-btn"
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