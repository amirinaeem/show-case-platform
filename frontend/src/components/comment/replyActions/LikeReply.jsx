// // LikeReply.js
// import { useLikeReplyMutation } from '../api/commentsApi';

// const LikeReply = ({ reply, currentUser }) => {
//   const [likeReply] = useLikeReplyMutation();
//   const isLiked = currentUser && reply.likes.includes(currentUser._id);

//   const handleLike = async () => {
//     if (!currentUser) return;
//     try {
//       await likeReply({
//         commentId: reply.comment,
//         replyId: reply._id
//       }).unwrap();
//     } catch (error) {
//       console.error('Failed to like reply:', error);
//     }
//   };

//   return (
//     <button 
//       onClick={handleLike}
//       className={`like-btn ${isLiked ? 'liked' : ''}`}
//       disabled={!currentUser}
//       aria-label={isLiked ? 'Unlike this reply' : 'Like this reply'}
//     >
//       <span className="icon">👍</span>
//       <span className="count">{reply.likes.length}</span>
//     </button>
//   );
// };

// export default LikeReply;