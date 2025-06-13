import { apiSlice } from './apiSlice';
import { MESSENGER_URL } from '../constants';

export const messengerSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => ({
        url: `${MESSENGER_URL}/friends`,
        method: 'GET'
      }),
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
      query: (id) => ({
        url: `${MESSENGER_URL}/get-message/${id}`,
        method: 'GET',
      }),
      providesTags: ['Messages']
    }),

    sendFileMessage: builder.mutation({
      query: (formData) => ({
        url: `${MESSENGER_URL}/send-file-message`,
        method: 'POST',
        body: formData,
        
      }),
      invalidatesTags: ['Messages']
    }),
  }), 
});

export const { 
  useGetFriendsQuery,
  useSendMessageMutation,
  useSendFileMessageMutation,
  useGetMessageQuery, 
} = messengerSlice;