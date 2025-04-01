// // LikeComment.js
// import { useLikeCommentMutation } from '../api/commentsApi';

// const LikeComment = ({ comment, currentUser }) => {
//   const [likeComment] = useLikeCommentMutation();
//   const isLiked = currentUser && comment.likes.includes(currentUser._id);

//   const handleLike = async () => {
//     if (!currentUser) return;
//     try {
//       await likeComment({
//         appId: comment.application,
//         commentId: comment._id
//       }).unwrap();
//     } catch (error) {
//       console.error('Failed to like comment:', error);
//     }
//   };

//   return (
//     <button 
//       onClick={handleLike}
//       className={`like-btn ${isLiked ? 'liked' : ''}`}
//       disabled={!currentUser}
//       aria-label={isLiked ? 'Unlike this comment' : 'Like this comment'}
//     >
//       <span className="icon">👍</span>
//       <span className="count">{comment.likes.length}</span>
//     </button>
//   );
// };

// export default LikeComment;