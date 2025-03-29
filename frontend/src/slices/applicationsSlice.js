import { APPLICATIONS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

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

    // Comment system endpoints
    createComment: builder.mutation({
      query: (data) => ({
        url: `${APPLICATIONS_URL}/${data.appId}/comments`,
        method: 'POST',
        body: { comment: data.comment },
      }),
      invalidatesTags: ( arg) => [
        { type: 'Application', id: arg.appId },
        { type: 'Comment', id: arg.appId }
      ],
    }),

    editComment: builder.mutation({
      query: ({ appId, commentId, newText }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments`,
        method: 'PUT',
        body: { commentId, newText },
      }),
      invalidatesTags: (arg) => [
        { type: 'Application', id: arg.appId },
        { type: 'Comment', id: arg.appId }
      ],
    }),

    deleteComment: builder.mutation({
      query: ({ appId, commentId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments`,
        method: 'DELETE',
        body: { commentId },
      }),
      invalidatesTags: (arg) => [
        { type: 'Application', id: arg.appId },
        { type: 'Comment', id: arg.appId }
      ],
    }),

    addReply: builder.mutation({
      query: ({ appId, commentId, reply }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/reply`,
        method: 'POST',
        body: {commentId, reply },
      }),
      invalidatesTags: (arg) => [
        { type: 'Application', id: arg.appId },
        { type: 'Comment', id: arg.appId }
      ],
      onQueryStarted: async ({ appId, commentId, reply }, { dispatch, getState, queryFulfilled }) => {
        // Get current user from Redux state
        const { userInfo } = getState().auth;
        
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails', 
            appId, 
            (draft) => {
              const comment = draft.comments.find(c => c._id === commentId);
              if (comment) {
                comment.replies = comment.replies || [];
                comment.replies.unshift({
                  _id: `optimistic-${Date.now()}`,
                  user: userInfo._id,
                  name: userInfo.name,
                  avatar: userInfo.avatar,
                  reply,
                  createdAt: new Date().toString(),
                  isOptimistic: true
                });
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
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
    }),

    // Share an application
    shareApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}/share`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
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
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useAddReplyMutation,
  useGetTopApplicationsQuery,
  useLikeApplicationMutation,
  useShareApplicationMutation,
} = applicationsApiSlice;