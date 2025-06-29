import { useState } from 'react';
import { useSendMessageMutation } from '../../slices/messengerSlice';
import { Button, Badge, Spinner } from 'react-bootstrap';
import { FaFileAlt, FaPaperPlane, FaUpload, FaImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileAudio, FaFileVideo, FaFileArchive, FaJs, FaPython, FaJava, FaPhp, FaHtml5, 
  FaCss3Alt, FaMarkdown, 
  FaTimesCircle} from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../assets/styles/messaging/upload.css';

// Update your FILE_ICONS mapping
const FILE_ICONS = {
  'image': FaImage,
  'application/pdf': FaFilePdf,
  'application/msword': FaFileWord,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FaFileWord,
  'application/vnd.ms-excel': FaFileExcel,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FaFileExcel,
  'audio': FaFileAudio,
  'video': FaFileVideo,
  'application/zip': FaFileArchive,
  'application/x-rar-compressed': FaFileArchive,
  'application/x-7z-compressed': FaFileArchive,
  // Programming language files
  'text/javascript': FaJs,
  'application/javascript': FaJs,
  'text/x-python': FaPython,
  'text/x-java': FaJava,
  'text/x-php': FaPhp,
  'text/html': FaHtml5,
  'text/css': FaCss3Alt,
  'text/markdown': FaMarkdown,
  'default': FaFileAlt
};

const UploadFiles = ({ selectFriend }) => {
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [sendMessage] = useSendMessageMutation();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes.length - 1
    );
    return `${(bytes / Math.pow(1024, i)).toFixed(i ? 2 : 0)} ${sizes[i]}`;
  };

 const getFileIcon = (fileType, fileName) => {
  // First check MIME types
  if (fileType.startsWith('image/')) return FILE_ICONS.image;
  if (fileType.startsWith('audio/')) return FILE_ICONS.audio;
  if (fileType.startsWith('video/')) return FILE_ICONS.video;
  
  // Then check for specific MIME types
  if (FILE_ICONS[fileType]) return FILE_ICONS[fileType];
  
  // Fall back to file extensions if MIME type is generic (like text/plain)
  const extension = fileName.split('.').pop().toLowerCase();
  const extensionIcons = {
    'js': FaJs,
    'py': FaPython,
    'java': FaJava,
    'php': FaPhp,
    'html': FaHtml5,
    'css': FaCss3Alt,
    'md': FaMarkdown,
    'ts': FaJs, // TypeScript
    'jsx': FaJs,
    'tsx': FaJs,
    'rb': FaFileAlt, // Ruby
    'go': FaFileAlt, // Go
    'rs': FaFileAlt, // Rust
    'sh': FaFileAlt, // Shell
    'json': FaFileAlt
  };
  
  return extensionIcons[extension] || FILE_ICONS.default;
};

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file sizes (example: 25MB limit)
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    const validFiles = files.filter(file => file.size <= MAX_SIZE);
    
    if (validFiles.length !== files.length) {
      toast.warning(`Some files exceeded the ${formatFileSize(MAX_SIZE)} limit and were not added`);
    }

    const newAttachments = validFiles.map(file => {
      const FileIcon = getFileIcon(file.type, file.name);
      return {
        type: file.type,
        file,
        name: file.name,
        size: formatFileSize(file.size),
        icon: <FileIcon size={18} className="me-2" />
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFilesHandler = async () => {
  if (attachments.length === 0 || !selectFriend?._id) {
    toast.warning('Please select files and a recipient');
    return;
  }
  
  setIsUploading(true);
  try {
    const formData = new FormData();
    attachments.forEach(att => formData.append('files', att.file));

    // Upload files to your endpoint
    const uploadResponse = await fetch('/api/uploads/files', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
      }
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'File upload failed');
    }

    const uploadedFiles = await uploadResponse.json();

    // Send message with file references
    const result = await sendMessage({
      receiverId: selectFriend._id,
      files: uploadedFiles.map(file => ({
        url: file.url,
        type: file.type,
        fileType: file.fileType,
        fileName: file.fileName,
        public_id: file.public_id
      })),
      text: '',
    });

    if (result.error) {
      throw result.error;
    }

    toast.success('Files sent successfully!');
    setAttachments([]);
  } catch (error) {
    console.error('Upload error:', error);
    toast.error(error.data?.message || error.message || 'Failed to send files');
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="upload-container">
      <Button variant="link" className="upload-btn">
        <label htmlFor="file-upload-input" className="cursor-pointer d-flex align-items-center">
          <FaUpload size={18} className="upload-icon" />
          
        </label>
        <input
          id="file-upload-input"
          type="file"
          multiple
          onChange={handleFileChange}
          className="d-none"
          accept="*/*"
        />
      </Button>

      {attachments.length > 0 && (
        <div className="upload-preview-container">
          <div className="preview-header">
            <strong>{attachments.length} file{attachments.length !== 1 ? 's' : ''} selected</strong>
            <Badge bg="secondary" className="ms-2">
              Total: {formatFileSize(attachments.reduce((sum, file) => sum + file.file.size, 0))}
            </Badge>
          </div>

          <div className="upload-items-list">
            {attachments.map((attachment, index) => (
  <div 
    key={`${attachment.name}-${index}`} 
    className="file-item d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded"
  >
    <div className="d-flex align-items-center">
      {attachment.icon}
      <div className="ms-2">
        <div className="file-name text-truncate" style={{maxWidth: '150px'}}>
          {attachment.name}
        </div>
        <div className="d-flex mt-1">
          <Badge bg="light" text="dark" className="file-size">
            {attachment.size}
          </Badge>
          <Badge 
            bg={attachment.type === 'code' ? 'primary' : 'info'} 
            className="file-type ms-2"
          >
            {attachment.type === 'code' 
              ? attachment.name.split('.').pop() 
              : attachment.type.split('/')[0]}
          </Badge>
        </div>
      </div>
    </div>
    <FaTimesCircle 
      className="text-danger ms-2"
      onClick={() => removeAttachment(index)}
      style={{cursor: 'pointer', flexShrink: 0}}
      aria-label={`Remove ${attachment.name}`}
    />
  </div>
))}
          </div>

          <Button
            variant="primary"
            onClick={uploadFilesHandler}
            disabled={isUploading}
            className="upload-send-btn"
          >
            {isUploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending...
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