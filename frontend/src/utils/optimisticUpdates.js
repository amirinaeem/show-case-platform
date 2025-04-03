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