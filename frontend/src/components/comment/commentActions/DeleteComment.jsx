// // DeleteComment.js
// import { useState } from 'react';
// import { useDeleteCommentMutation } from '../api/commentsApi';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';

// const DeleteComment = ({ commentId, appId }) => {
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deleteComment] = useDeleteCommentMutation();

//   const handleDelete = async () => {
//     try {
//       await deleteComment({ appId, commentId }).unwrap();
//       setShowConfirm(false);
//     } catch (error) {
//       console.error('Failed to delete comment:', error);
//     }
//   };

//   return (
//     <>
//       <button 
//         onClick={() => setShowConfirm(true)}
//         className="delete-btn"
//         aria-label="Delete this comment"
//       >
//         <span className="icon">🗑️</span> Delete
//       </button>

//       <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this comment? This action cannot be undone.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowConfirm(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default DeleteComment;