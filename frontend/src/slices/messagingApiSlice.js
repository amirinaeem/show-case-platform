// features/messaging/messagingApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import messagingOptimisticHandler from '../utils/messagingOptimisticHandler';

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
  transformResponse: (response) => {
    // Sort conversations by latest message date
    return response.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
)},
  providesTags: (result) =>
    result
      ? [
          ...result.map(({ _id }) => ({ type: 'Conversation', id: _id })),
          { type: 'Conversation', id: 'LIST' },
        ]
      : [{ type: 'Conversation', id: 'LIST' }],
}),


    createConversation: builder.mutation({
      query: (data) => ({
        url: '/api/messages/conversations',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Conversation', id: 'LIST' }],
      ...messagingOptimisticHandler.createHandler().execute(
        'createConversation',
        'createConversation'
      ),
    }),
    getMessages: builder.query({
      query: ({ conversationId, page = 1 }) => 
        `/api/messages/conversations/${conversationId}/messages?page=${page}`,
      providesTags: (result, error, { conversationId }) => [
        { type: 'Message', id: conversationId }
      ],
      keepUnusedDataFor: 30 // seconds
    }),

    sendMessage: builder.mutation({
      query: ({ conversationId, ...data }) => ({
        url: `/api/messages/conversations/${conversationId}/messages`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Message', id: conversationId },
        { type: 'Conversation', id: conversationId }
      ],
      ...messagingOptimisticHandler.createHandler().execute(
        'sendMessage',
        'sendMessage'
      ),
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
      },
      ...messagingOptimisticHandler.createHandler().execute(
        'uploadAttachment',
        'uploadAttachment'
      ),
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