// // CommentForm.js (updated)
// import { useState } from 'react';
// import { useAddCommentMutation } from '../api/commentsApi';
// import { v4 as uuidv4 } from 'uuid';
// import { toast } from 'react-toastify';

// const CommentForm = ({ appId, currentUser, replyingTo, setReplyingTo, onCommentAdded }) => {
//   const [text, setText] = useState('');
//   const [addComment, { isLoading }] = useAddCommentMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const trimmedText = text.trim();
//     if (!trimmedText) return;

//     const tempId = uuidv4();
//     const optimisticComment = {
//       _id: tempId,
//       text: trimmedText,
//       user: {
//         _id: currentUser._id,
//         name: currentUser.name,
//         avatar: currentUser.avatar
//       },
//       likes: [],
//       replies: [],
//       createdAt: new Date().toISOString(),
//       isOptimistic: true
//     };

//     try {
//       // Optimistic update
//       onCommentAdded(optimisticComment, replyingTo);
//       setText('');
//       if (replyingTo) setReplyingTo(null);

//       // Actual API call
//       const result = await addComment({
//         appId,
//         text: trimmedText,
//         replyTo: replyingTo
//       }).unwrap();

//       // Replace optimistic comment with real data
//       onCommentAdded(result.comment, replyingTo, tempId);
//     } catch (error) {
//       // Rollback on error
//       onCommentAdded(null, replyingTo, tempId);
//       toast.error(error?.data?.message || 'Failed to add comment');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="comment-form">
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder={replyingTo ? 'Write your reply...' : 'Write your comment...'}
//         disabled={isLoading}
//         aria-label={replyingTo ? 'Reply text area' : 'Comment text area'}
//       />
//       <div className="form-actions">
//         {replyingTo && (
//           <button 
//             type="button" 
//             onClick={() => setReplyingTo(null)}
//             className="cancel-btn"
//           >
//             Cancel
//           </button>
//         )}
//         <button 
//           type="submit" 
//           disabled={!text.trim() || isLoading}
//           className="submit-btn"
//         >
//           {isLoading ? 'Posting...' : replyingTo ? 'Post Reply' : 'Post Comment'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CommentForm;