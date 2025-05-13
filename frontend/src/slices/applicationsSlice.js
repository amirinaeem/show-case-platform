import { APPLICATIONS_URL } from '../constants';
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

    getLinkPreview: builder.query({
      query: (url) => ({
        url: `${APPLICATIONS_URL}/link-preview`,
        params: { url },
      }),
    }),

    addComment: builder.mutation({
      query: ({ appId, comment, linkPreview }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments`,
        method: 'POST',
        body: { comment, linkPreview },
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'commentAdd',
        'commentAdd'
      ),
    }),

    editComment: builder.mutation({
      query: ({ appId, commentId, newText, linkPreview }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/editComment`,
        method: 'PUT',
        body: { newText, linkPreview },  
      }),
      invalidatesTags: (result, error, appId) => [
        { type: 'Application', id: appId },
        'Comment',
      ],
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
      query: ({ appId, commentId, reply, linkPreview }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies`,
        method: 'POST',
        body: { reply, linkPreview },
      }),
      invalidatesTags: (result, error, appId) => [
        { type: 'Application', id: appId },
        'Comment',
      ],
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
      query: ({ appId, commentId, replyId, newText, linkPreview }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies/${replyId}/editReply`,
        method: 'PUT',
        body: { newText, linkPreview },
      }),
      invalidatesTags: (result, error, appId) => [
        { type: 'Application', id: appId },
        'Comment',
      ],
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'replyEdit',
        'replyEdit'
      ),
    }),

    deleteReply: builder.mutation({
      query: ({ appId, commentId, replyId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies/${replyId}/deleteReply`,
        method: 'DELETE',
      }),
      onQueryStarted: optimisticHandler.createHandler(apiSlice).execute(
        'replyDelete',
        'replyDelete'
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
  useDeleteReplyMutation
} = applicationsApiSlice;
