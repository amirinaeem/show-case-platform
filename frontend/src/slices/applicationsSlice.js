import { APPLICATIONS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';
import optimisticHandler from '../utils/optimisticHandler';

export const applicationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'likeToggle',
        'likeToggle'
      ),
    }),

    shareApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}/share`,
        method: 'POST',
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'shareIncrement',
        'shareIncrement'
      ),
    }),

    addComment: builder.mutation({
      query: ({ appId, comment }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments`,
        method: 'POST',
        body: { comment },
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentAdd',
        'commentAdd'
      ),
    }),

    editComment: builder.mutation({
      query: ({ appId, commentId, newText }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/editComment`,
        method: 'PUT',
        body: { newText },
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentEdit',
        'commentEdit'
      ),
    }),

    deleteComment: builder.mutation({
      query: ({ appId, commentId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/deleteComment`,
        method: 'DELETE',
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentDelete',
        'commentDelete'
      ),
    }),

    replyToComment: builder.mutation({
      query: ({ appId, commentId, reply }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replyComment`,
        method: 'POST',
        body: { reply },
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentReply',
        'commentReply'
      ),
    }),

    likeComment: builder.mutation({
      query: ({ appId, commentId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/likeComment`,
        method: 'POST',
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentLike',
        'commentLike'
      ),
    }),

    likeToReply: builder.mutation({
      query: ({ appId, commentId, replyId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies/${replyId}/likeReply`,
        method: 'POST',
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'replyLike',
        'replyLike'
      ),
    }),

    editReply: builder.mutation({
      query: ({ appId, commentId, replyId, newText }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies/${replyId}`,
        method: 'PUT',
        body: { newText },
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'replyEdit',
        'replyEdit'
      ),
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useGetApplicationDetailsQuery,
  useGetTopApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useUploadApplicationFileMutation,
  useCreateReviewMutation,
  useLikeApplicationMutation,
  useShareApplicationMutation,
  useAddCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useReplyToCommentMutation,
  useLikeCommentMutation,
  useLikeToReplyMutation,
  useEditReplyMutation,
} = applicationsApiSlice;
