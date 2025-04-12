import { APPLICATIONS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';
import optimisticHandler from '../utils/optimisticHandler';

export const applicationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all applications
    getApplications: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: APPLICATIONS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Application'],
    }),

    // Fetch a single application by ID
    getApplicationDetails: builder.query({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, appId) => [
        { type: 'Application', id: appId },
        'Comment',
      ],
    }),

    // Create a new application
    createApplication: builder.mutation({
      query: () => ({
        url: APPLICATIONS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
    }),

    // Update an application
    updateApplication: builder.mutation({
      query: ({ appId, ...data }) => ({
        url: `${APPLICATIONS_URL}/${appId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),

    // Upload application file
    uploadApplicationFile: builder.mutation({
      query: ({ file, fileType }) => ({
        url: `${UPLOAD_URL}/${fileType}`,
        method: 'POST',
        body: file,
      }),
    }),

    // Delete an application
    deleteApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application'],
    }),

    // Create a review
    createReview: builder.mutation({
      query: (data) => ({
        url: `${APPLICATIONS_URL}/${data.appId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),

    // Get top applications
    getTopApplications: builder.query({
      query: () => ({
        url: `${APPLICATIONS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Like an application
    likeApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        optimisticHandler.actions.likeToggle,
        (appId, { getState }) => ({ userId: getState().auth.userInfo?._id })
      )
    }),

    // Share an application
    shareApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}/share`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        (draft) => {
          draft.shares = (draft.shares || 0) + 1;
          if (draft.metrics) {
            draft.metrics.shares = (draft.metrics.shares || 0) + 1;
          }
        },
        () => ({}) // No data needed for share
      )
    }),

    // Comment system endpoints
    addComment: builder.mutation({
      query: ({ appId, comment }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments`,
        method: 'POST',
        body: { comment }
      }),
      invalidatesTags: (result, error, { appId }) => [
        { type: 'Application', id: appId }
      ],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        optimisticHandler.actions.commentAdd,
        optimisticHandler.preparers.commentAdd
      )
    }),

    editComment: builder.mutation({
      query: ({ appId, commentId, newText }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}`,
        method: 'PUT',
        body: { newText },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
      ],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        (draft, { commentId, newText }) => {
          const comment = draft.comments.find(c => c._id === commentId);
          if (comment) {
            comment.comment = newText;
            comment.isEdited = true;
            comment.editedAt = new Date().toISOString();
          }
        },
        (arg) => ({ commentId: arg.commentId, newText: arg.newText })
      )
    }),

    deleteComment: builder.mutation({
      query: ({ appId, commentId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { appId }) => [
        { type: 'Application', id: appId }
      ],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        optimisticHandler.actions.commentDelete,
        optimisticHandler.preparers.commentDelete
      )
    }),

    likeComment: builder.mutation({
      query: ({ appId, commentId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/like`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, { appId }) => [
        { type: 'Application', id: appId }
      ],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        optimisticHandler.actions.commentLikeToggle,
        (arg, { getState }) => ({
          commentId: arg.commentId,
          userId: getState().auth.userInfo?._id
        })
      )
    }),

    addReply: builder.mutation({
      query: ({ appId, commentId, reply, replyToId = null }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies`,
        method: 'POST',
        body: { reply, replyToId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
        { type: 'Comment', id: arg.commentId }
      ],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        (draft, { commentId, optimisticReply }) => {
          const comment = draft.comments.find(c => c._id === commentId);
          if (comment) {
            comment.replies.unshift(optimisticReply);
            draft.metrics.repliesCount = (draft.metrics.repliesCount || 0) + 1;
          }
        },
        (arg, { getState }) => {
          const { userInfo } = getState().auth;
          return {
            commentId: arg.commentId,
            optimisticReply: {
              _id: `optimistic-reply-${Date.now()}`,
              user: userInfo._id,
              name: userInfo.name,
              avatar: userInfo.avatar || '',
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
      )
    }),

    editReply: builder.mutation({
      query: ({ appId, commentId, replyId, newText }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies/${replyId}`,
        method: 'PUT',
        body: { newText },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
      ],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        (draft, { commentId, replyId, newText }) => {
          const comment = draft.comments.find(c => c._id === commentId);
          if (comment) {
            const reply = comment.replies.find(r => r._id === replyId);
            if (reply) {
              reply.reply = newText;
              reply.isEdited = true;
              reply.editedAt = new Date().toISOString();
            }
          }
        },
        (arg) => ({
          commentId: arg.commentId,
          replyId: arg.replyId,
          newText: arg.newText
        })
      )
    }),

    deleteReply: builder.mutation({
      query: ({ appId, commentId, replyId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies/${replyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
      ],
      onQueryStarted: optimisticHandler.handler(apiSlice).prepare(
        (draft, { commentId, replyId }) => {
          const comment = draft.comments.find(c => c._id === commentId);
          if (comment) {
            const replyIndex = comment.replies.findIndex(r => r._id === replyId);
            if (replyIndex !== -1) {
              comment.replies.splice(replyIndex, 1);
              draft.metrics.repliesCount -= 1;
            }
          }
        },
        (arg) => ({
          commentId: arg.commentId,
          replyId: arg.replyId
        })
      )
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useGetApplicationDetailsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useUploadApplicationFileMutation,
  useDeleteApplicationMutation,
  useCreateReviewMutation,
  useAddCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useAddReplyMutation,
  useEditReplyMutation,
  useDeleteReplyMutation,
  useGetTopApplicationsQuery,
  useLikeApplicationMutation,
  useShareApplicationMutation,
} = applicationsApiSlice;