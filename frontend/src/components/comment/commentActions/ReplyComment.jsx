// // ReplyComment.js
// const ReplyComment = ({ isReplying, onReply, commentId }) => {
//     return (
//       <button
//         onClick={() => onReply(isReplying ? null : commentId)}
//         className={`reply-btn ${isReplying ? 'active' : ''}`}
//         aria-label={isReplying ? 'Cancel reply' : 'Reply to this comment'}
//       >
//         {isReplying ? (
//           <>
//             <span className="icon">✕</span> Cancel
//           </>
//         ) : (
//           <>
//             <span className="icon">↩️</span> Reply
//           </>
//         )}
//       </button>
//     );
//   };
  
//   export default ReplyComment;