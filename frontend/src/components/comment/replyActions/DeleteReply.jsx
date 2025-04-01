// // DeleteReply.js
// import { useState } from 'react';
// import { useDeleteReplyMutation } from '../api/commentsApi';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';

// const DeleteReply = ({ reply, appId, commentId }) => {
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deleteReply] = useDeleteReplyMutation();

//   const handleDelete = async () => {
//     try {
//       await deleteReply({
//         appId,
//         commentId,
//         replyId: reply._id
//       }).unwrap();
//       setShowConfirm(false);
//     } catch (error) {
//       console.error('Failed to delete reply:', error);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setShowConfirm(true)}
//         className="delete-reply-btn"
//         aria-label="Delete reply"
//       >
//         <span className="icon">🗑️</span> Delete
//       </button>

//       <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this reply? This action cannot be undone.
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

// export default DeleteReply;