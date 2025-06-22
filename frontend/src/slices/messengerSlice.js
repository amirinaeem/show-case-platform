import { apiSlice } from './apiSlice';
import { MESSENGER_URL } from '../constants';

export const messengerSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => `${MESSENGER_URL}/friends`,
      providesTags: ['Friends']
    }),

    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: `${MESSENGER_URL}/send-message`,
        method: 'POST',
        body: messageData
      }),
      invalidatesTags: ['Messages']
    }),

    getMessage: builder.query({
      query: (id) => `${MESSENGER_URL}/get-message/${id}`,
      providesTags: ['Messages']
    }),
  }), 
});

export const { 
  useGetFriendsQuery,
  useSendMessageMutation,
  useGetMessageQuery, 
} = messengerSlice;