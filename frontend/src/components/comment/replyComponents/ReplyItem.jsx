// // ReplyItem.js
// import ReplyActions from './ReplyActions';

// const ReplyItem = ({ reply, appId, commentId, currentUser }) => {
//   return (
//     <div className="reply-item">
//       <div className="reply-header">
//         <img src={reply.user.avatar} alt={reply.user.name} />
//         <span className="reply-author">{reply.user.name}</span>
//         <span className="reply-date">
//           {new Date(reply.createdAt).toLocaleString()}
//           {reply.isEdited && ' (edited)'}
//         </span>
//       </div>
      
//       <div className="reply-content">
//         <p>{reply.text}</p>
//       </div>
      
//       <ReplyActions 
//         reply={reply}
//         appId={appId}
//         commentId={commentId}
//         currentUser={currentUser}
//       />
//     </div>
//   );
// };

// export default ReplyItem;