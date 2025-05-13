import { useState } from 'react';
import { useUploadAttachmentMutation } from '../../slices/messagingApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

function UploadAttachments({ conversationId }) {
  const [uploadAttachment, { isLoading }] = useUploadAttachmentMutation();
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('attachment', file);

      await uploadAttachment({
        conversationId,
        file: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      }).unwrap();

      setProgress(0);
    } catch (err) {
      console.error('Failed to upload attachment:', err);
      setProgress(0);
    }
  };

  return (
    <div className="attachment-upload">
      <label htmlFor="attachment-upload" className="input-group-text attach_btn">
        <FontAwesomeIcon icon={faPaperclip} />
        <input
          id="attachment-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
      </label>
      {isLoading && (
        <div className="upload-progress">
          <progress value={progress} max="100" />
          <span>{progress}%</span>
        </div>
      )}
    </div>
  );
}

export default UploadAttachments;