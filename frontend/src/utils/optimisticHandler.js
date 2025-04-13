import { toast } from 'react-toastify';

const optimisticHandler = {
  createHandler: (apiSlice) => ({
    execute: (actionName, dataPreparer) => async (arg, { dispatch, getState, queryFulfilled }) => {
      try {
        const state = getState();
        const currentUser = state.auth?.userInfo;
        
        // Prepare optimistic data - pass both state and getState
        const context = { state, getState };
        const optimisticData = dataPreparer(arg, currentUser, context);
        
        // Apply optimistic update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            'getApplicationDetails',
            arg.appId,
            (draft) => {
              if (!draft) return;
              optimisticHandler.actions[actionName](draft, optimisticData);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          throw error;
        }
      } catch (error) {
        toast.error(error.message || 'Operation failed');
        throw error;
      }
    }
  }),

  // Action implementations
  actions: {
    likeToggle(draft, { userId }) {
      draft.likes = draft.likes || [];
      const likeIndex = draft.likes.indexOf(userId);
      
      if (likeIndex === -1) {
        draft.likes.push(userId);
        if (draft.metrics) draft.metrics.likes = (draft.metrics.likes || 0) + 1;
      } else {
        draft.likes.splice(likeIndex, 1);
        if (draft.metrics) draft.metrics.likes = Math.max(0, (draft.metrics.likes || 0) - 1);
      }
    },

    commentAdd(draft, { comment, currentUser, optimisticId }) {
      draft.comments = draft.comments || [];
      
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

    commentEdit(draft, { commentId, newText }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (comment) {
        comment.comment = newText;
        comment.isEdited = true;
        comment.editedAt = new Date().toISOString();
        comment.status = "edited";
      }
    },

    commentDelete(draft, { commentId }) {
      if (!draft.comments) return;
      
      const commentExists = draft.comments.some(c => c._id === commentId);
      if (commentExists && draft.metrics) {
        draft.metrics.commentsCount = Math.max(0, (draft.metrics.commentsCount || 0) - 1);
      }
      draft.comments = draft.comments.filter(c => c._id !== commentId);
    },

    commentLikeToggle(draft, { commentId, userId }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment) return;
      
      comment.likes = comment.likes || [];
      const likeIndex = comment.likes.indexOf(userId);
      
      if (likeIndex === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes.splice(likeIndex, 1);
      }
    },

    replyAdd(draft, { commentId, optimisticReply }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment) return;
      
      comment.replies = comment.replies || [];
      comment.replies.unshift(optimisticReply);
      
      if (draft.metrics) {
        draft.metrics.repliesCount = (draft.metrics.repliesCount || 0) + 1;
      }
    }
  },

  // Data preparers
  preparers: {
    likeToggle(arg, _, { getState }) {
      return { 
        userId: getState().auth.userInfo?._id 
      };
    },
    
    commentAdd(arg, currentUser) {
      return {
        comment: arg.comment,
        currentUser,
        optimisticId: `optimistic-${Date.now()}`
      };
    },
    
    commentEdit(arg) {
      return {
        commentId: arg.commentId,
        newText: arg.newText
      };
    },
    
    commentDelete(arg) {
      return { 
        commentId: arg.commentId 
      };
    },
    
    commentLikeToggle(arg, _, { getState }) {
      return { 
        commentId: arg.commentId, 
        userId: getState().auth.userInfo?._id 
      };
    },
    
    replyAdd(arg, currentUser) {
      return {
        commentId: arg.commentId,
        optimisticReply: {
          _id: `optimistic-reply-${Date.now()}`,
          user: currentUser._id,
          name: currentUser.name,
          avatar: currentUser.avatar || '',
          reply: arg.reply,
          replyTo: arg.replyToId || null,
          likes: [],
          isEdited: false,
          isOptimistic: true,
          createdAt: new Date().toISOString(),
          status: 'active'
        }
      };
    }
  }
};

export default optimisticHandler;