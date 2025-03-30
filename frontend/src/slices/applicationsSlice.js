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
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
      ],
      async onQueryStarted({ appId, comment }, { dispatch, queryFulfilled }) {
        try {
          const { data: { comment: newComment } } = await queryFulfilled;
          dispatch(
            applicationsApiSlice.util.updateQueryData(
              'getApplicationDetails',
              appId,
              (draft) => {
                draft.comments.unshift(newComment);
                draft.metrics.commentsCount += 1;
              }
            )
          );
        } catch (error) {
          console.error('Failed to create comment:', error);
        }
      },
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
      async onQueryStarted({ appId, commentId, newText }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails',
            appId,
            (draft) => {
              const comment = draft.comments.find(c => c._id === commentId);
              if (comment) {
                comment.comment = newText;
                comment.isEdited = true;
                comment.editedAt = new Date().toISOString();
              }
            }
          )
        );
    
        try {
          await queryFulfilled; 
        } catch {
          patchResult.undo();
          
        }
      },
    }),

    deleteComment: builder.mutation({
      query: ({ appId, commentId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
      ],
      async onQueryStarted({ appId, commentId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails',
            appId,
            (draft) => {
              const commentIndex = draft.comments.findIndex(c => c._id === commentId);
              if (commentIndex !== -1) {
                const replyCount = draft.comments[commentIndex].replies?.length || 0;
                draft.comments.splice(commentIndex, 1);
                draft.metrics.commentsCount -= 1;
                draft.metrics.repliesCount -= replyCount;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    likeComment: builder.mutation({
      query: ({ appId, commentId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
      ],
      async onQueryStarted({ appId, commentId, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails',
            appId,
            (draft) => {
              const comment = draft.comments.find(c => c._id === commentId);
              if (comment) {
                const likeIndex = comment.likes.indexOf(userId);
                if (likeIndex === -1) {
                  comment.likes.push(userId);
                  draft.metrics.commentLikes += 1;
                } else {
                  comment.likes.splice(likeIndex, 1);
                  draft.metrics.commentLikes -= 1;
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    addReply: builder.mutation({
      query: ({ appId, commentId, reply, replyToId = null }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies`,
        method: 'POST',
        body: { 
          reply,
          replyToId 
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
        { type: 'Comment', id: arg.commentId }
      ],
      async onQueryStarted({ appId, commentId, reply, replyToId }, { dispatch, queryFulfilled, getState }) {
        const { userInfo } = getState().auth;
        const tempId = `optimistic-reply-${Date.now()}`;
        
        const optimisticReply = {
          _id: tempId,
          user: userInfo._id,
          name: userInfo.name,
          avatar: userInfo.avatar || '',
          reply,
          replyTo: replyToId || null,
          likes: [],
          isEdited: false,
          isOptimistic: true,
          createdAt: new Date().toISOString(),
          status: 'active'
        };
    
        // Optimistic update
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails', 
            appId, 
            (draft) => {
              const comment = draft.comments.find(c => c._id === commentId);
              if (comment) {
                comment.replies.unshift(optimisticReply);
                draft.metrics.repliesCount = (draft.metrics.repliesCount || 0) + 1;
              }
            }
          )
        );
    
        try {
          const { data } = await queryFulfilled;
          
          // Update with server response
          dispatch(
            applicationsApiSlice.util.updateQueryData(
              'getApplicationDetails',
              appId,
              (draft) => {
                const comment = draft.comments.find(c => c._id === commentId);
                if (comment) {
                  const replyIndex = comment.replies.findIndex(r => r._id === tempId);
                  if (replyIndex !== -1) {
                    comment.replies[replyIndex] = {
                      ...data.reply,
                      // Preserve any local-only fields
                      isOptimistic: false
                    };
                  }
                  draft.metrics.repliesCount = data.metrics.repliesCount;
                }
              }
            )
          );
        } catch (error) {
          patchResult.undo();
          console.error('Failed to add reply:', error);
          // Error toast will be handled in the component
        }
      },
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
      async onQueryStarted({ appId, commentId, replyId, newText }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails',
            appId,
            (draft) => {
              const comment = draft.comments.find(c => c._id === commentId);
              if (comment) {
                const reply = comment.replies.find(r => r._id === replyId);
                if (reply) {
                  reply.reply = newText;
                  reply.isEdited = true;
                  reply.editedAt = new Date().toISOString();
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteReply: builder.mutation({
      query: ({ appId, commentId, replyId }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comments/${commentId}/replies/${replyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Application', id: arg.appId },
      ],
      async onQueryStarted({ appId, commentId, replyId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails',
            appId,
            (draft) => {
              const comment = draft.comments.find(c => c._id === commentId);
              if (comment) {
                const replyIndex = comment.replies.findIndex(r => r._id === replyId);
                if (replyIndex !== -1) {
                  comment.replies.splice(replyIndex, 1);
                  draft.metrics.repliesCount -= 1;
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
      async onQueryStarted(appId, { dispatch, queryFulfilled, getState }) { // Add getState here
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails',
            appId,
            (draft) => {
              draft.likes = draft.likes || [];
              const userId = getState().auth.userInfo?._id; // Now getState is available
              if (userId) {
                const likeIndex = draft.likes.indexOf(userId);
                if (likeIndex === -1) {
                  draft.likes.push(userId);
                } else {
                  draft.likes.splice(likeIndex, 1);
                }
                draft.metrics.likes = draft.likes.length;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    // Share an application
    shareApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}/share`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
      async onQueryStarted(appId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          applicationsApiSlice.util.updateQueryData(
            'getApplicationDetails',
            appId,
            (draft) => {
              draft.shares = (draft.shares || 0) + 1;
              draft.metrics.shares = (draft.metrics.shares || 0) + 1;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
  useLikeCommentMutation,
  useAddReplyMutation,
  useEditReplyMutation,
  useDeleteReplyMutation,
  useGetTopApplicationsQuery,
  useLikeApplicationMutation,
  useShareApplicationMutation,
} = applicationsApiSlice;