// // EditReply.js
// import { useState } from 'react';
// import { useEditReplyMutation } from '../api/commentsApi';

// const EditReply = ({ reply, commentId }) => {
//   const [editReply] = useEditReplyMutation();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState(reply.text);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!editText.trim()) return;
    
//     try {
//       await editReply({
//         commentId,
//         replyId: reply._id,
//         newText: editText
//       }).unwrap();
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Failed to edit reply:', error);
//     }
//   };

//   return (
//     <>
//       {isEditing ? (
//         <form onSubmit={handleSubmit} className="edit-reply-form">
//           <textarea
//             value={editText}
//             onChange={(e) => setEditText(e.target.value)}
//             aria-label="Edit reply"
//           />
//           <div className="edit-actions">
//             <button type="submit">Save</button>
//             <button 
//               type="button" 
//               onClick={() => setIsEditing(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       ) : (
//         <button
//           onClick={() => setIsEditing(true)}
//           className="edit-reply-btn"
//           aria-label="Edit reply"
//         >
//           <span className="icon">✏️</span> Edit
//         </button>
//       )}
//     </>
//   );
// };

// export default EditReply;