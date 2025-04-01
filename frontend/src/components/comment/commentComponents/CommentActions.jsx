

// import LikeComment from '../commentActions/LikeComment';
// import ReplyComment from '../../../slices/commentSection/comment/commentActons/ReplyComment';
// import EditComment from '../../../slices/commentSection/comment/commentActons/EditComment';
// import DeleteComment from '../../../slices/commentSection/comment/commentActons/DeleteComment';

// const CommentActions = ({
//   comment,
//   currentUser,
//   isReplying,
//   onReply,
//   isEditing,
//   onEdit,
//   showReplies,
//   setShowReplies
// }) => {
//   const isOwner = currentUser && currentUser._id === comment.user._id;
//   const hasReplies = comment.replies && comment.replies.length > 0;

//   return (
//     <div className="comment-actions">
//       {/* Like button */}
//       <LikeComment 
//         comment={comment} 
//         currentUser={currentUser} 
//       />
      
//       {/* Reply button */}
//       <ReplyComment 
//         isReplying={isReplying}
//         onReply={onReply}
//         commentId={comment._id}
//       />
      
//       {/* Edit/Delete buttons (only for owner) */}
//       {isOwner && (
//         <>
//           <EditComment 
//             isEditing={isEditing}
//             onEdit={onEdit}
//             commentId={comment._id}
//           />
//           <DeleteComment 
//             commentId={comment._id}
//             appId={appId}
//           />
//         </>
//       )}
      
//       {/* Toggle replies visibility */}
//       {hasReplies && (
//         <button 
//           onClick={() => setShowReplies(!showReplies)}
//           className="toggle-replies-btn"
//         >
//           {showReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}
//         </button>
//       )}
//     </div>
//   );
// };

// export default CommentActions;