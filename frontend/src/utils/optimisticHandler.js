import { toast } from 'react-toastify';

const optimisticHandler = {
  createHandler: (apiSlice) => ({
    execute: (actionName, preparerName) => async (arg, { dispatch, getState, queryFulfilled }) => {
      try {
        
        if (!optimisticHandler.actions[actionName]) {
          throw new Error(`Action ${actionName} not found`);
        }
        if (!optimisticHandler.preparers[preparerName]) {
          throw new Error(`Preparer ${preparerName} not found`);
        }

        const state = getState();
        const currentUser = state.auth?.userInfo;

        if (!currentUser?._id) {
          throw new Error('User not authenticated');
        }
        
       
        const dataPreparer = optimisticHandler.preparers[preparerName];
        
        
        const context = { state, getState };
        const optimisticData = dataPreparer(arg, currentUser, context);
        
       
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
          toast.error(error.message || 'Operation failed');
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

    commentReply(draft, { commentId, reply, currentUser, optimisticId }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment) return;
      
      comment.replies = comment.replies || [];
      comment.replies.unshift({
        _id: optimisticId,
        user: currentUser._id,
        name: currentUser.name,
        avatar: currentUser.avatar || '/SHCAPL-logo.jpg',
        reply,
        replyTo: comment.user,
        likes: [],
        isEdited: false,
        isOptimistic: true,
        status: "active",
        createdAt: new Date().toISOString()
      });
      
      if (draft.metrics) {
        draft.metrics.repliesCount = (draft.metrics.repliesCount || 0) + 1;
      }
    },

    commentLike(draft, { commentId, userId }) {
      if (!draft.comments) return;
      
      const comment = draft.comments.find(c => c._id === commentId);
      if (!comment) return;
      
      comment.likes = comment.likes || [];
      const likeIndex = comment.likes.indexOf(userId);
      if (likeIndex === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes.splice(likeIndex, 1);
      }
    },

    replyLike(draft, { commentId, replyId, userId }) {
      if (!draft.comments) return;
      
      const comment = draft.comments.find(c => c._id === commentId);
      if (!comment || !comment.replies) return;

      const reply = comment.replies.find(r => r._id === replyId);
      if (!reply) return;
      
      reply.likes = reply.likes || [];
      const likeIndex = reply.likes.indexOf(userId);
      
      if (likeIndex === -1) {
        reply.likes.push(userId);
      } else {
        reply.likes.splice(likeIndex, 1);
      }
    },

    shareIncrement(draft) {
      draft.shares = (draft.shares || 0) + 1;
      if (draft.metrics) {
        draft.metrics.shares = (draft.metrics.shares || 0) + 1;
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

    commentReply(arg, currentUser) {
      return {
        commentId: arg.commentId,
        reply: arg.reply,
        currentUser,
        optimisticId: `optimistic-reply-${Date.now()}`
      };
    },

    commentLike(arg, currentUser) {
      return {
        commentId: arg.commentId,
        userId: currentUser._id
      };
    },
    
    shareIncrement() {
      return {};
    },
    replyLike(arg, currentUser) {
      return {
        commentId: arg.commentId,
        replyId: arg.replyId,
        userId: currentUser._id
      };
    }
  }
};

export default optimisticHandler;