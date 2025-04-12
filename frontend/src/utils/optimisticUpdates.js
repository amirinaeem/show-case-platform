
 const optimisticLikeUpdate = {
  onLikeToggle: (draft, userId) => {
    if (!draft.likes) draft.likes = [];
    const likeIndex = draft.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      draft.likes.push(userId);
    } else {
      draft.likes.splice(likeIndex, 1);
    }
    
    if (draft.metrics) {
      draft.metrics.likes = draft.likes.length;
    }
  },

  getUpdatedLikeState: (currentState, userId) => {
    const isLiked = currentState.likes?.includes(userId);
    const likeCount = currentState.metrics?.likes || currentState.likes?.length || 0;
    
    return {
      isLiked: !isLiked,
      likeCount: isLiked ? likeCount - 1 : likeCount + 1
    };
  }
};

// Comment additions
 const optimisticCommentUpdates = {
  onCommentAdd: (draft, { comment, currentUser, optimisticId }) => {
    if (!draft.comments) draft.comments = [];
    
    draft.comments.unshift({
      _id: optimisticId,
      user: currentUser._id,
      name: currentUser.name,
      avatar: currentUser.avatar || '/SHCAPL-logo.jpg',
      comment,
      replies: [],
      likes: [],
      isEdited: false,
      isOptimistic: true,
      status: "active",
      pinned: false,
      createdAt: new Date().toISOString()
    });
    
    if (draft.metrics) {
      draft.metrics.commentsCount = (draft.metrics.commentsCount || 0) + 1;
    }
   },
   onCommentDelete: (draft, { commentId }) => {
    if (!draft?.comments) return;
    
    // Create NEW array reference (crucial for React updates)
    const updatedComments = draft.comments.filter(c => c._id !== commentId);
    
    // Only proceed if something changed
    if (updatedComments.length !== draft.comments.length) {
      draft.comments = updatedComments; // This assignment triggers update
      
      // Safely update count
      if (draft.metrics?.commentsCount) {
        draft.metrics.commentsCount = updatedComments.length;
      }
    }
  }
};

// Comment deletion (standalone export)



export {
  optimisticLikeUpdate,
  optimisticCommentUpdates,
 }