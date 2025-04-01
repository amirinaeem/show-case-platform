// // ReplyActions.js
// import LikeReply from '../replyActions/LikeReply';
// import EditReply from '../replyActions/EditReply';
// import DeleteReply from '../replyActions/DeleteReply';
// import ReplyToReply from '../replyActions/ReplyToReply';

// const ReplyActions = ({ reply, appId, commentId, currentUser }) => {
//   const isOwner = currentUser && currentUser._id === reply.user._id;

//   return (
//     <div className="reply-actions">
//       <LikeReply 
//         reply={reply}
//         currentUser={currentUser}
//       />
      
//       <ReplyToReply 
//         commentId={commentId}
//         replyId={reply._id}
//       />
      
//       {isOwner && (
//         <>
//           <EditReply 
//             reply={reply}
//             commentId={commentId}
//           />
//           <DeleteReply 
//             reply={reply}
//             appId={appId}
//             commentId={commentId}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default ReplyActions;