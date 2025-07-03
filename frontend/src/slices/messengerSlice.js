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
      // Critical: Invalidate the exact query that needs updating
      invalidatesTags: (result) => [
        { type: 'Messages', id: result?.receiverId }
      ],
    }),

    getMessage: builder.query({
      query: (id) => `${MESSENGER_URL}/get-message/${id}`,
      providesTags: (result, error, id) => [
        { type: 'Messages', id }
      ],
    }),
  }), 
});

export const { 
  useGetFriendsQuery,
  useSendMessageMutation,
  useGetMessageQuery, 
} = messengerSlice;