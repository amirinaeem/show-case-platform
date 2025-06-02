
import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

     register: builder.mutation({
      query: (formData) => ({
        url: USERS_URL,
        method: 'POST',
        body: formData,
      }),
    }),
    
    authUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),


    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User', _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
      keepUnusedDataFor: 5,
      // Removed the socket-related code from here - we'll handle that elsewhere
    }),
    
    getAllUsers: builder.query({
      query: () => '/api/users',
      providesTags: ['Users'],
    }),
   
    getUser: builder.query({
      query: (userId) => ({
        url: `/api/users/${userId}`,
        method: 'GET'
      }),
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }]
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      providesTags: (result, error, userId) => [{ type: 'User', _id: userId }],
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', _id: userId },
      ],
    }),

    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `${USERS_URL}/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', _id: userId },
      ],
    }),
  }),
});

export const {
  useAuthUserMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useGetAllUsersQuery
} = usersApiSlice;