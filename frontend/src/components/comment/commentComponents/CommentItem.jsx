
// import { useState } from 'react';
// import CommentActions from '../../../slices/commentSection/comment/CommentActions';
// import ReplyList from '../../ReplyList';
// import ReplyForm from '../../ReplyForm';

// const CommentItem = ({ 
//   comment, 
//   appId, 
//   currentUser, 
//   isReplying, 
//   onReply,
//   isEditing,
//   onEdit
// }) => {
//   const [showReplies, setShowReplies] = useState(false);

//   return (
//     <div className="comment-item">
//       <div className="comment-header">
//         <img src={comment.user.avatar} alt={comment.user.name} />
//         <span className="comment-author">{comment.user.name}</span>
//         <span className="comment-date">
//           {new Date(comment.createdAt).toLocaleString()}
//         </span>
//       </div>
      
//       <div className="comment-content">
//         {comment.text}
//       </div>
      
//       {/* All action buttons will go here */}
//       <CommentActions
//         comment={comment}
//         currentUser={currentUser}
//         isReplying={isReplying}
//         onReply={onReply}
//         isEditing={isEditing}
//         onEdit={onEdit}
//         showReplies={showReplies}
//         setShowReplies={setShowReplies}
//       />
      
//       {/* Form for replying to this comment */}
//       {isReplying && (
//         <ReplyForm 
//           appId={appId}
//           commentId={comment._id}
//           onCancel={() => onReply(null)}
//         />
//       )}
      
//       {/* List of replies to this comment */}
//       {showReplies && (
//         <ReplyList 
//           replies={comment.replies || []}
//           appId={appId}
//           commentId={comment._id}
//           currentUser={currentUser}
//         />
//       )}
//     </div>
//   );
// };

// export default CommentItem;