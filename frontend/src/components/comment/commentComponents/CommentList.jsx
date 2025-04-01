
// import CommentItem from './CommentItem';

// const CommentList = ({ 
//   appId, 
//   currentUser, 
//   replyingTo, 
//   setReplyingTo,
//   editingComment,
//   setEditingComment
// }) => {
//   // In a real app, you would fetch comments here
//   const [comments, setComments] = useState([]); // Will be populated from API

//   return (
//     <div className="comment-list">
//       {comments.map(comment => (
//         <CommentItem
//           key={comment._id}
//           comment={comment}
//           appId={appId}
//           currentUser={currentUser}
//           isReplying={replyingTo === comment._id}
//           onReply={setReplyingTo}
//           isEditing={editingComment === comment._id}
//           onEdit={setEditingComment}
//         />
//       ))}
//     </div>
//   );
// };

// export default CommentList;