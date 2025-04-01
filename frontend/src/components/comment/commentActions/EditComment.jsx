// // EditComment.js
// import { useState } from 'react';
// import { useEditCommentMutation } from '../api/commentsApi';

// const EditComment = ({ commentId, isEditing, onEdit }) => {
//   const [editComment] = useEditCommentMutation();
//   const [editText, setEditText] = useState('');

//   const handleEdit = async () => {
//     try {
//       await editComment({
//         commentId,
//         newText: editText
//       }).unwrap();
//       onEdit(null); // Close edit mode
//     } catch (error) {
//       console.error('Failed to edit comment:', error);
//     }
//   };

//   return (
//     <>
//       {isEditing ? (
//         <div className="edit-comment-form">
//           <textarea
//             value={editText}
//             onChange={(e) => setEditText(e.target.value)}
//             placeholder="Edit your comment..."
//           />
//           <div className="edit-actions">
//             <button onClick={handleEdit}>Save</button>
//             <button onClick={() => onEdit(null)}>Cancel</button>
//           </div>
//         </div>
//       ) : (
//         <button 
//           onClick={() => onEdit(commentId)}
//           className="edit-btn"
//           aria-label="Edit this comment"
//         >
//           <span className="icon">✏️</span> Edit
//         </button>
//       )}
//     </>
//   );
// };

// export default EditComment;