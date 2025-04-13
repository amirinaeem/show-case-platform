import { APPLICATIONS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';
import optimisticHandler from '../utils/optimisticHandler';

export const applicationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Basic Application Endpoints
    getApplications: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: APPLICATIONS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Application'],
    }),

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

    createApplication: builder.mutation({
      query: () => ({
        url: APPLICATIONS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
    }),

    updateApplication: builder.mutation({
      query: ({ appId, ...data }) => ({
        url: `${APPLICATIONS_URL}/${appId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),

    uploadApplicationFile: builder.mutation({
      query: ({ file, fileType }) => ({
        url: `${UPLOAD_URL}/${fileType}`,
        method: 'POST',
        body: file,
      }),
    }),

    deleteApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application'],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${APPLICATIONS_URL}/${data.appId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),

    getTopApplications: builder.query({
      query: () => ({
        url: `${APPLICATIONS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),

    likeApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'likeToggle',
        optimisticHandler.preparers.likeToggle
      )
    }),

    shareApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}/share`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        (draft) => {
          draft.shares = (draft.shares || 0) + 1;
          if (draft.metrics) {
            draft.metrics.shares = (draft.metrics.shares || 0) + 1;
          }
        },
        () => ({})
      )
    }),

    addComment: builder.mutation({
      query: ({ appId, comment }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments`,
        method: 'POST',
        body: { comment }
      }),
      invalidatesTags: (result, error, { appId }) => [
        { type: 'Application', id: appId }
      ],
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentAdd',
        optimisticHandler.preparers.commentAdd
      )
    }),

    editComment: builder.mutation({
      query: ({ appId, commentId, newText }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}`,
        method: 'PUT',
        body: { newText }
      }),
      invalidatesTags: (result, error, { appId }) => [
        { type: 'Application', id: appId },
        'Comment'
      ],
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentEdit',
        optimisticHandler.preparers.commentEdit
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
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentDelete',
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
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentLikeToggle',
        optimisticHandler.preparers.commentLikeToggle
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
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'replyAdd',
        optimisticHandler.preparers.replyAdd
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
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
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
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        (draft, { commentId, replyId }) => {
          const comment = draft.comments.find(c => c._id === commentId);
          if (comment) {
            const replyIndex = comment.replies.findIndex(r => r._id === replyId);
            if (replyIndex !== -1) {
              comment.replies.splice(replyIndex, 1);
              draft.metrics.repliesCount = Math.max(0, (draft.metrics.repliesCount || 0) - 1);
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

// Export hooks in a consistent order
export const {
  // Query hooks
  useGetApplicationsQuery,
  useGetApplicationDetailsQuery,
  useGetTopApplicationsQuery,
  
  // Application CRUD mutations
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useUploadApplicationFileMutation,
  
  // Review mutations
  useCreateReviewMutation,
  
  // Engagement mutations
  useLikeApplicationMutation,
  useShareApplicationMutation,
  
  // Comment system mutations
  useAddCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  
  // Reply system mutations
  useAddReplyMutation,
  useEditReplyMutation,
  useDeleteReplyMutation,
} = applicationsApiSlice;