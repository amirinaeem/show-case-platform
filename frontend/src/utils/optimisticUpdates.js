export const optimisticLikeUpdate = {
  // Optimistic update for like toggle
  onLikeToggle: (draft, userId) => {
    draft.likes = draft.likes || [];
    const likeIndex = draft.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      draft.likes.push(userId); // Add like
    } else {
      draft.likes.splice(likeIndex, 1); // Remove like
    }
    
    draft.metrics.likes = draft.likes.length; // Update count
    return draft;
  },

  // Optimistic UI state update
  getUpdatedLikeState: (currentState, userId) => {
    const isLiked = currentState.likes?.includes(userId);
    const likeCount = currentState.metrics?.likes || currentState.likes?.length || 0;
    
    return {
      isLiked: !isLiked,
      likeCount: isLiked ? likeCount - 1 : likeCount + 1
    };
  }
};


export const optimisticCommentUpdates = {
  onCommentAdd: (draft, { comment, currentUser, optimisticId }) => {
    draft.comments = draft.comments || [];
    
    const newComment = {
      _id: optimisticId,
      user: currentUser._id,
      name: currentUser.name,
      avatar: currentUser.avatar || '/SHCAPL-logo.jpg',
      comment: comment,
      replies: [],
      likes: [],
      isEdited: false,
      isOptimistic: true,
      status: "active",
      pinned: false,
      createdAt: new Date().toISOString()
    };

    draft.comments.unshift(newComment);
    
    if (draft.metrics) {
      draft.metrics.commentsCount = (draft.metrics.commentsCount || 0) + 1;
    }
  }
};