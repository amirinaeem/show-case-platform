import { toast } from 'react-toastify';

const optimisticHandler = {
  // Create a thunk handler for a given action and data preparer
  createHandler: (apiSlice) => ({
    execute: (actionName, preparerName) => 
      async (arg, { dispatch, getState, queryFulfilled }) => {
        try {
          const { actions, preparers } = optimisticHandler;
          
          if (!actions[actionName]) {
            throw new Error(`Action "${actionName}" not found`);
          }
          if (!preparers[preparerName]) {
            throw new Error(`Preparer "${preparerName}" not found`);
          }

          const currentUser = getState().auth?.userInfo;
          if (!currentUser?._id) {
            throw new Error('User not authenticated');
          }

          const optimisticData = preparers[preparerName](arg, currentUser, { getState });

          const patchResult = dispatch(
            apiSlice.util.updateQueryData(
              'getApplicationDetails',
              arg.appId,
              (draft) => {
                if (!draft) return;
                actions[actionName](draft, optimisticData);
              }
            )
          );

          try {
            const { data: confirmed } = await queryFulfilled;

            dispatch(
              apiSlice.util.updateQueryData(
                'getApplicationDetails',
                arg.appId,
                (draft) => {
                  if (!draft?.comments) return;

                  // Handle confirmed data for different actions
                  if (actionName === 'commentAdd') {
                    const index = draft.comments.findIndex(
                      c => c._id === optimisticData.optimisticId
                    );
                    if (index !== -1) draft.comments[index] = confirmed;
                  }

                  if (actionName === 'commentReply') {
                    const comment = draft.comments.find(
                      c => c._id === optimisticData.commentId
                    );
                    if (!comment?.replies) return;

                    const index = comment.replies.findIndex(
                      r => r._id === optimisticData.optimisticId
                    );
                    if (index !== -1) comment.replies[index] = confirmed;
                  }
                }
              )
            );
          } catch (error) {
            patchResult.undo();
            toast.error(error.message || 'Server error occurred');
            throw error;
          }
        } catch (error) {
          toast.error(error.message || 'Unexpected error occurred');
          throw error;
        }
      }
  }),

  // Optimistic state actions
  actions: {
    likeToggle(draft, { userId }) {
      if (!draft.likes) draft.likes = [];
      const index = draft.likes.indexOf(userId);
      
      if (index === -1) {
        draft.likes.push(userId);
        if (draft.metrics) {
          draft.metrics.likes = (draft.metrics.likes || 0) + 1;
        }
      } else {
        draft.likes.splice(index, 1);
        if (draft.metrics) {
          draft.metrics.likes = Math.max(0, (draft.metrics.likes || 0) - 1);
        }
      }
    },

    commentAdd(draft, { comment, currentUser, optimisticId, linkPreview }) {
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
        status: 'active',
        pinned: false,
        createdAt: new Date().toISOString(),
        linkPreview: linkPreview || null,
      });

      if (draft.metrics) {
        draft.metrics.commentsCount = (draft.metrics.commentsCount || 0) + 1;
      }
    },

    commentEdit(draft, { commentId, newText, linkPreview }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment) return;

      comment.comment = newText;
      comment.isEdited = true;
      comment.editedAt = new Date().toISOString();
      comment.status = 'edited';
      comment.linkPreview = linkPreview || null;
    },

    commentDelete(draft, { commentId }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment) return;

      const repliesCount = comment.replies?.length || 0;
      if (draft.metrics) {
        draft.metrics.commentsCount = Math.max(
          0,
          (draft.metrics.commentsCount || 0) - (1 + repliesCount)
        );
      }

      draft.comments = draft.comments.filter(c => c._id !== commentId);
    },

    commentReply(draft, { commentId, reply, currentUser, optimisticId }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment) return;

      if (!comment.replies) comment.replies = [];
      
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
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      if (draft.metrics) {
        draft.metrics.repliesCount = (draft.metrics.repliesCount || 0) + 1;
      }
    },

    commentLike(draft, { commentId, userId }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment) return;

      if (!comment.likes) comment.likes = [];
      const index = comment.likes.indexOf(userId);
      index === -1 
        ? comment.likes.push(userId) 
        : comment.likes.splice(index, 1);
    },

    replyLike(draft, { commentId, replyId, userId }) {
      const reply = draft.comments
        ?.find(c => c._id === commentId)
        ?.replies?.find(r => r._id === replyId);
      if (!reply) return;

      if (!reply.likes) reply.likes = [];
      const index = reply.likes.indexOf(userId);
      index === -1 
        ? reply.likes.push(userId) 
        : reply.likes.splice(index, 1);
    },

    shareIncrement(draft) {
      draft.shares = (draft.shares || 0) + 1;
      if (draft.metrics) {
        draft.metrics.shares = (draft.metrics.shares || 0) + 1;
      }
    },

    replyEdit(draft, { commentId, replyId, newText }) {
      const reply = draft.comments
        ?.find(c => c._id === commentId)
        ?.replies?.find(r => r._id === replyId);

      if (reply) {
        reply.reply = newText;
        reply.isEdited = true;
        reply.editedAt = new Date().toISOString();
        reply.status = 'edited';
      }
    },

    replyDelete(draft, { commentId, replyId }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment?.replies) return;

      comment.replies = comment.replies.filter(r => r._id !== replyId);
      if (draft.metrics) {
        draft.metrics.repliesCount = Math.max(
          0, 
          (draft.metrics.repliesCount || 0) - 1
        );
      }
    },
  },

  // Data preparers for each action
  preparers: {
    likeToggle(arg, _, { getState }) {
      return { userId: getState().auth.userInfo?._id };
    },

    commentAdd(arg, currentUser, { getState }) {
      return {
        comment: arg.comment,
        currentUser,
        optimisticId: `optimistic-${Date.now()}`,
        linkPreview: getState().applications?.linkPreview
      };
    },

    commentEdit(arg, _, { getState }) {
      return {
        commentId: arg.commentId,
        newText: arg.newText,
        linkPreview: getState().applications?.linkPreview
      };
    },

    commentDelete(arg) {
      return { commentId: arg.commentId };
    },

    commentReply(arg, currentUser) {
      return {
        commentId: arg.commentId,
        reply: arg.reply,
        currentUser,
        optimisticId: `optimistic-reply-${Date.now()}`,
      };
    },

    commentLike(arg, currentUser) {
      return {
        commentId: arg.commentId,
        userId: currentUser._id,
      };
    },

    shareIncrement() {
      return {};
    },

    replyLike(arg, currentUser) {
      return {
        commentId: arg.commentId,
        replyId: arg.replyId,
        userId: currentUser._id,
      };
    },

    replyEdit(arg) {
      return {
        commentId: arg.commentId,
        replyId: arg.replyId,
        newText: arg.newText,
      };
    },

    replyDelete(arg) {
      return {
        commentId: arg.commentId,
        replyId: arg.replyId,
      };
    },
  },
};

export default optimisticHandler;