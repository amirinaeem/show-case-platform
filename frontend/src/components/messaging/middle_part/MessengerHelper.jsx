import { Image } from 'react-bootstrap';
import { FaFileAlt } from 'react-icons/fa';

export const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const renderMessageContent = (msg) => {
  // Handle both message structures
  const content = msg.message || msg;
  const { files = [], text } = content;
  
  if (files?.length > 0) {
    return (
      <div className="file-message">
        {files.map((file, i) => (
          <div key={i} className="file-attachment-display">
            {file.type === 'image' ? (
              <Image 
                src={file.url} 
                className="shared-image" 
                thumbnail 
                alt={`Attachment ${i}`}
              />
            ) : (
              <>
                <FaFileAlt size={24} />
                <div className="file-info">
                  <span className="file-name">{file.fileName}</span>
                  <span className="file-size">{file.fileType}</span>
                </div>
              </>
            )}
          </div>
        ))}
        {text && <p className="message-text mb-0">{text}</p>}
      </div>
    );
  }
  return <p className="message-text mb-0">{text || content.text}</p>;
};