import { toast } from 'react-toastify';

const optimisticHandler = {
  // Generic handler for all optimistic updates
  handler: (apiSlice) => ({
    prepare: (actionName, dataPreparer) => async (arg, { dispatch, getState, queryFulfilled }) => {
      const { auth } = getState();
      const currentUser = auth?.userInfo;
      
      // Prepare optimistic data
      const optimisticData = dataPreparer(arg, currentUser);
      
      // Apply optimistic update
      const patchResult = dispatch(
        apiSlice.util.updateQueryData(
          'getApplicationDetails',
          arg.appId,
          (draft) => {
            if (!draft) return;
            actionName(draft, optimisticData);
          }
        )
      );

      try {
        await queryFulfilled;
      } catch (error) {
        patchResult.undo();
        toast.error(error.message || 'Operation failed');
        throw error;
      }
    }
  }),

  // Action implementations
  actions: {
    likeToggle: (draft, { userId }) => {
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

    commentAdd: (draft, { comment, currentUser, optimisticId }) => {
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

    commentDelete: (draft, { commentId }) => {
      if (!draft.comments) return;
      const updatedComments = draft.comments.filter(c => c._id !== commentId);
      
      if (updatedComments.length !== draft.comments.length) {
        draft.comments = updatedComments;
        if (draft.metrics?.commentsCount) {
          draft.metrics.commentsCount = updatedComments.length;
        }
      }
    },

    commentLikeToggle: (draft, { commentId, userId }) => {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (comment) {
        const likeIndex = comment.likes.indexOf(userId);
        if (likeIndex === -1) {
          comment.likes.push(userId);
          if (draft.metrics) draft.metrics.commentLikes += 1;
        } else {
          comment.likes.splice(likeIndex, 1);
          if (draft.metrics) draft.metrics.commentLikes -= 1;
        }
      }
    }
  },

  // Data preparers
  preparers: {
    likeToggle: (arg) => ({ userId: arg.userId }),
    commentAdd: (arg, currentUser) => ({
      comment: arg.comment,
      currentUser,
      optimisticId: `optimistic-${Date.now()}`
    }),
    commentDelete: (arg) => ({ commentId: arg.commentId }),
    commentLikeToggle: (arg) => ({ 
      commentId: arg.commentId, 
      userId: arg.userId 
    })
  }
};


export default optimisticHandler