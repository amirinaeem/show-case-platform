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

    replyToComment: builder.mutation({
      query: ({ appId, commentId, reply }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}`,
        method: 'POST',
        body: { reply },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure auth header
        }
      }),
      invalidatesTags: (result, error, { appId }) => [
        { type: 'Application', id: appId }
      ],
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentReply',
        optimisticHandler.preparers.commentReply
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
  useReplyToCommentMutation

} = applicationsApiSlice;