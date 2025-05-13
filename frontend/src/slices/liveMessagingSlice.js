// features/messaging/messagingApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../constants';

export const messagingApiSlice = createApi({
  reducerPath: 'messagingApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Conversation', 'Message'],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => '/api/messages/conversations',
      providesTags: ['Conversation']
    }),
    createConversation: builder.mutation({
      query: (data) => ({
        url: '/api/messages/conversations',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Conversation']
    }),
    getMessages: builder.query({
      query: ({ conversationId, page = 1 }) => 
        `/api/messages/conversations/${conversationId}/messages?page=${page}`,
      providesTags: ['Message']
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, ...data }) => ({
        url: `/api/messages/conversations/${conversationId}/messages`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Message']
    }),
    uploadAttachment: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('attachment', file);
        
        return {
          url: '/api/messages/upload-attachment',
          method: 'POST',
          body: formData
        };
      }
    })
  })
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useUploadAttachmentMutation
} = messagingApiSlice;