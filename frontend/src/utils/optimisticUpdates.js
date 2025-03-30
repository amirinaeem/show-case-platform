// utils/optimisticUpdates.js
export const createOptimisticComment = (currentUser, commentText) => {
  return {
    _id: `optimistic-${Date.now()}`,
    user: currentUser._id,
    name: currentUser.name,
    avatar: currentUser.avatar || '',
    comment: commentText,
    createdAt: new Date().toISOString(),
    isOptimistic: true,
    isEdited: false,
    likes: [],
    replies: []
  };
};

export const createOptimisticReply = (currentUser, replyText, replyToId = null) => {
  return {
    _id: `optimistic-reply-${Date.now()}`,
    user: currentUser._id,
    name: currentUser.name,
    avatar: currentUser.avatar || '',
    reply: replyText,
    replyTo: replyToId,
    createdAt: new Date().toISOString(),
    isOptimistic: true,
    isEdited: false,
    likes: []
  };
};

export const optimisticAddComment = ({ currentUser, commentText }) => {
  return {
    type: 'ADD_COMMENT',
    comment: createOptimisticComment(currentUser, commentText)
  };
};

export const optimisticUpdateComment = ({ commentId, newText }) => {
  return {
    type: 'UPDATE_COMMENT',
    commentId,
    updates: {
      comment: newText,
      isEdited: true,
      editedAt: new Date().toISOString(),
      isOptimistic: true
    }
  };
};

export const optimisticDeleteComment = (commentId) => {
  return {
    type: 'DELETE_COMMENT',
    commentId
  };
};

export const optimisticAddReply = ({ currentUser, replyText, replyToId = null }) => {
  return {
    type: replyToId ? 'ADD_REPLY_TO_REPLY' : 'ADD_REPLY',
    reply: createOptimisticReply(currentUser, replyText, replyToId),
    replyToId
  };
};

export const optimisticUpdateReply = ({ commentId, replyId, newText }) => {
  return {
    type: 'UPDATE_REPLY',
    commentId,
    replyId,
    updates: {
      reply: newText,
      isEdited: true,
      editedAt: new Date().toISOString(),
      isOptimistic: true
    }
  };
};

export const optimisticDeleteReply = ({ commentId, replyId }) => {
  return {
    type: 'DELETE_REPLY',
    commentId,
    replyId
  };
};

export const optimisticToggleLike = ({ commentId, userId, isLiked }) => {
  return {
    type: 'TOGGLE_LIKE',
    commentId,
    userId,
    isLiked
  };
};

export const updateCommentWithOptimisticReply = (draft, commentId, optimisticReply) => {
  const comment = draft.comments.find(c => c._id === commentId);
  if (comment) {
    comment.replies = comment.replies || [];
    comment.replies.unshift(optimisticReply);
    draft.metrics.repliesCount = (draft.metrics.repliesCount || 0) + 1;
  }
  return draft;
};

export const updateReplyWithServerResponse = (draft, commentId, tempId, serverReply) => {
  const comment = draft.comments.find(c => c._id === commentId);
  if (comment) {
    const replyIndex = comment.replies.findIndex(r => r._id === tempId);
    if (replyIndex !== -1) {
      comment.replies[replyIndex] = serverReply;
    }
  }
  return draft;
};

export const handleOptimisticUpdates = (draft, action) => {
  switch (action.type) {
    case 'ADD_COMMENT':
      draft.comments.unshift(action.comment);
      draft.metrics.commentsCount = (draft.metrics.commentsCount || 0) + 1;
      break;
      
    case 'UPDATE_COMMENT':
      const commentToUpdate = draft.comments.find(c => c._id === action.commentId);
      if (commentToUpdate) {
        Object.assign(commentToUpdate, action.updates);
      }
      break;
      
    case 'DELETE_COMMENT':
      const commentIndex = draft.comments.findIndex(c => c._id === action.commentId);
      if (commentIndex !== -1) {
        const replyCount = draft.comments[commentIndex].replies?.length || 0;
        draft.comments.splice(commentIndex, 1);
        draft.metrics.commentsCount = Math.max((draft.metrics.commentsCount || 0) - 1, 0);
        draft.metrics.repliesCount = Math.max((draft.metrics.repliesCount || 0) - replyCount, 0);
      }
      break;
      
    case 'ADD_REPLY':
    case 'ADD_REPLY_TO_REPLY':
      const targetComment = draft.comments.find(c => c._id === action.commentId);
      if (targetComment) {
        targetComment.replies = targetComment.replies || [];
        targetComment.replies.unshift(action.reply);
        draft.metrics.repliesCount = (draft.metrics.repliesCount || 0) + 1;
      }
      break;
      
    case 'UPDATE_REPLY':
      const commentWithReply = draft.comments.find(c => c._id === action.commentId);
      if (commentWithReply) {
        const replyToUpdate = commentWithReply.replies.find(r => r._id === action.replyId);
        if (replyToUpdate) {
          Object.assign(replyToUpdate, action.updates);
        }
      }
      break;
      
    case 'DELETE_REPLY':
      const commentForDelete = draft.comments.find(c => c._id === action.commentId);
      if (commentForDelete) {
        const replyIndex = commentForDelete.replies.findIndex(r => r._id === action.replyId);
        if (replyIndex !== -1) {
          commentForDelete.replies.splice(replyIndex, 1);
          draft.metrics.repliesCount = Math.max((draft.metrics.repliesCount || 0) - 1, 0);
        }
      }
      break;
      
    case 'TOGGLE_LIKE':
      const commentToLike = draft.comments.find(c => c._id === action.commentId);
      if (commentToLike) {
        const likeIndex = commentToLike.likes.indexOf(action.userId);
        if (likeIndex === -1) {
          commentToLike.likes.push(action.userId);
        } else {
          commentToLike.likes.splice(likeIndex, 1);
        }
      }
      break;
      
    default:
      break;
  }
  return draft;
};