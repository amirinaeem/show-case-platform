// // ReplyForm.js
// import { useState } from 'react';
// import { useAddReplyMutation } from '../api/commentsApi';

// const ReplyForm = ({ appId, commentId, onCancel }) => {
//   const [text, setText] = useState('');
//   const [addReply, { isLoading }] = useAddReplyMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;
    
//     try {
//       await addReply({
//         appId,
//         commentId,
//         text
//       }).unwrap();
      
//       setText('');
//       onCancel();
//     } catch (error) {
//       console.error('Failed to add reply:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="reply-form">
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Write your reply..."
//         disabled={isLoading}
//       />
//       <div className="form-actions">
//         <button 
//           type="button" 
//           onClick={onCancel}
//           className="cancel-btn"
//         >
//           Cancel
//         </button>
//         <button 
//           type="submit" 
//           disabled={!text.trim() || isLoading}
//           className="submit-btn"
//         >
//           {isLoading ? 'Posting...' : 'Post Reply'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ReplyForm;