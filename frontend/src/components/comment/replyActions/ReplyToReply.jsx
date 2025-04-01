// // ReplyToReply.js
// import { useState } from 'react';
// import { useAddReplyToReplyMutation } from '../api/commentsApi';

// const ReplyToReply = ({ commentId, replyId }) => {
//   const [isReplying, setIsReplying] = useState(false);
//   const [replyText, setReplyText] = useState('');
//   const [addReply, { isLoading }] = useAddReplyToReplyMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!replyText.trim()) return;
    
//     try {
//       await addReply({
//         commentId,
//         replyId,
//         text: replyText
//       }).unwrap();
//       setReplyText('');
//       setIsReplying(false);
//     } catch (error) {
//       console.error('Failed to add reply:', error);
//     }
//   };

//   return (
//     <>
//       {isReplying ? (
//         <form onSubmit={handleSubmit} className="reply-to-reply-form">
//           <textarea
//             value={replyText}
//             onChange={(e) => setReplyText(e.target.value)}
//             placeholder="Write your reply..."
//             disabled={isLoading}
//             aria-label="Reply to reply"
//           />
//           <div className="form-actions">
//             <button 
//               type="button" 
//               onClick={() => setIsReplying(false)}
//               className="cancel-btn"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               disabled={!replyText.trim() || isLoading}
//               className="submit-btn"
//             >
//               {isLoading ? 'Posting...' : 'Post Reply'}
//             </button>
//           </div>
//         </form>
//       ) : (
//         <button
//           onClick={() => setIsReplying(true)}
//           className="reply-to-reply-btn"
//           aria-label="Reply to this reply"
//         >
//           <span className="icon">↩️</span> Reply
//         </button>
//       )}
//     </>
//   );
// };

// export default ReplyToReply;