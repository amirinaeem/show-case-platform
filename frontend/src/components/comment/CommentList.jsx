import React from 'react';
import { Card } from 'react-bootstrap';


const CommentsList = ({ comments = [] }) => {
  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];
  
  return (
    <Card.Body className="p-3">
      {safeComments.length > 0 ? (
        <>
          <Card.Title as="h6" className="mb-3">
            Comments ({safeComments.length})
          </Card.Title>
          <div className="comments-list">
            {safeComments.map((comment) => {
              // Add null checks for all comment properties
              if (!comment) return null;
              console.log(comment.avatar)
              return (
                <div key={comment._id || comment.comment} className="mb-3 p-2">
                  <div className="d-flex align-items-center mb-2">
                    <img 
                      src={comment.avatar || '/SHCAPL-logo.jpg'} 
                      alt={comment.name || 'User'} 
                      className="rounded-circle me-2" 
                      width="32" 
                      height="32" 
                    />
                    <strong>{comment.name || 'Anonymous'}</strong>
                  </div>
                  <p className="mb-1">{comment.comment || ''}</p>
                  {comment.createdAt && (
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-muted">No comments yet</p>
      )}
    </Card.Body>
  );
};

export default CommentsList;