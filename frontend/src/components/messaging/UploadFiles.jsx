import { useState } from 'react';
import { useSendMessageMutation } from '../../slices/messengerSlice';
import { Button, Badge, CloseButton, Spinner } from 'react-bootstrap';
import { FaFileAlt, FaPaperPlane, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../assets/styles/messaging/UploadFiles.css'; // Create this CSS file for custom styles

const UploadFiles = () => {

  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [sendMessage] = useSendMessageMutation();

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const newAttachments = files.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'file',
      file,
      name: file.name,
      size: formatFileSize(file.size),
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadFiles = async () => {
    if (attachments.length === 0) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      attachments.forEach(att => formData.append('files', att.file));
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/uploads/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      toast.success('Files uploaded successfully!');
      setAttachments([]);
    } catch (error) {
      toast.error(error.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <Button variant="link" className="upload-icon-button p-0">
        <label htmlFor="file-upload-input" className="cursor-pointer d-flex align-items-center">
          <FaUpload size={18} className="upload-icon" />
          
        </label>
        <input
          id="file-upload-input"
          type="file"
          multiple
          onChange={handleFileChange}
          className="d-none"
          accept="*/*" // Or specify file types: "image/*,.pdf,.doc,.docx"
        />
      </Button>

      {attachments.length > 0 && (
        <div className="attachments-preview mt-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="attachment-item d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded">
              <div className="file-preview d-flex align-items-center">
                <FaFileAlt size={20} className="me-2 text-primary" />
                <div className="file-info">
                  <div className="file-name text-truncate" style={{ maxWidth: '150px' }}>
                    {attachment.name}
                  </div>
                  <Badge bg="secondary" className="file-size-badge">
                    {attachment.size}
                  </Badge>
                </div>
              </div>
              <CloseButton onClick={() => removeAttachment(index)} className="ms-2" />
            </div>
          ))}

          <Button
            variant="primary"
            size="sm"
            onClick={uploadFiles}
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
                Send {attachments.length > 1 ? 'Files' : 'File'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadFiles;