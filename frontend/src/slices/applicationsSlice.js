
import { APPLICATIONS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const applicationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all applications
    getApplications: builder.query({
      query: () => ({
        url: APPLICATIONS_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    // Fetch a single application by ID
    getApplicationDetails: builder.query({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Create a new application
    createApplication: builder.mutation({
      query: () => ({
        url: APPLICATIONS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
    }),

    updateApplication: builder.mutation({
      query: (data) => ({
        url: `${APPLICATIONS_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['application'],
    }),

    // Like an application
    likeApplication: builder.mutation({
      query: (appId) => ({
        url: `${APPLICATIONS_URL}/${appId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
    }),

    // Add a comment to an application
    addComment: builder.mutation({
      query: ({ appId, text }) => ({
        url: `${APPLICATIONS_URL}/${appId}/comment`,
        method: 'POST',
        body: { text },
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
  useLikeApplicationMutation,
  useAddCommentMutation,
  useShareApplicationMutation,
  useUpdateApplicationMutation
} = applicationsApiSlice;