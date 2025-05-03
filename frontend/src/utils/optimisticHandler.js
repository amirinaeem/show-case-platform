import { toast } from 'react-toastify';

const optimisticHandler = {
  // Create a thunk handler for a given action and data preparer
  createHandler: (apiSlice) => ({
    execute: (actionName, preparerName) =>
      async (arg, { dispatch, getState, queryFulfilled }) => {
        try {
          const action = optimisticHandler.actions[actionName];
          const preparer = optimisticHandler.preparers[preparerName];
          if (!action) throw new Error(`Action "${actionName}" not found`);
          if (!preparer) throw new Error(`Preparer "${preparerName}" not found`);

          const state = getState();
          const currentUser = state.auth?.userInfo;
          if (!currentUser?._id) throw new Error('User not authenticated');

          const optimisticData = preparer(arg, currentUser, { state, getState });

          const patchResult = dispatch(
            apiSlice.util.updateQueryData(
              'getApplicationDetails',
              arg.appId,
              (draft) => {
                if (!draft) return;
                action(draft, optimisticData);
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

                  if (actionName === 'commentAdd') {
                    const i = draft.comments.findIndex(c => c._id === optimisticData.optimisticId);
                    if (i !== -1) draft.comments[i] = confirmed;
                  }

                  if (actionName === 'commentReply') {
                    const comment = draft.comments.find(c => c._id === optimisticData.commentId);
                    if (!comment?.replies) return;

                    const i = comment.replies.findIndex(r => r._id === optimisticData.optimisticId);
                    if (i !== -1) comment.replies[i] = confirmed;
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
      draft.likes = draft.likes || [];
      const i = draft.likes.indexOf(userId);
      if (i === -1) {
        draft.likes.push(userId);
        if (draft.metrics) draft.metrics.likes = (draft.metrics.likes || 0) + 1;
      } else {
        draft.likes.splice(i, 1);
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
        status: 'active',
        pinned: false,
        createdAt: new Date().toISOString(),
      });
      if (draft.metrics) draft.metrics.commentsCount = (draft.metrics.commentsCount || 0) + 1;
    },

    commentEdit(draft, { commentId, newText }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (comment) {
        comment.comment = newText;
        comment.isEdited = true;
        comment.editedAt = new Date().toISOString();
        comment.status = 'edited';
      }
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
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      if (draft.metrics) draft.metrics.repliesCount = (draft.metrics.repliesCount || 0) + 1;
    },

    commentLike(draft, { commentId, userId }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      if (!comment) return;

      comment.likes = comment.likes || [];
      const i = comment.likes.indexOf(userId);
      i === -1 ? comment.likes.push(userId) : comment.likes.splice(i, 1);
    },

    replyLike(draft, { commentId, replyId, userId }) {
      const comment = draft.comments?.find(c => c._id === commentId);
      const reply = comment?.replies?.find(r => r._id === replyId);
      if (!reply) return;

      reply.likes = reply.likes || [];
      const i = reply.likes.indexOf(userId);
      i === -1 ? reply.likes.push(userId) : reply.likes.splice(i, 1);
    },

    shareIncrement(draft) {
      draft.shares = (draft.shares || 0) + 1;
      if (draft.metrics) draft.metrics.shares = (draft.metrics.shares || 0) + 1;
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
        draft.metrics.repliesCount = Math.max(0, (draft.metrics.repliesCount || 0) - 1);
      }
    },
  },

  // Data preparers for each action
  preparers: {
    likeToggle(arg, _, { getState }) {
      return { userId: getState().auth.userInfo?._id };
    },

    commentAdd(arg, currentUser) {
      return {
        comment: arg.comment,
        currentUser,
        optimisticId: `optimistic-${Date.now()}`,
      };
    },

    commentEdit(arg) {
      return {
        commentId: arg.commentId,
        newText: arg.newText,
      };
    },

    commentDelete(arg) {
      return {
        commentId: arg.commentId,
      };
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
