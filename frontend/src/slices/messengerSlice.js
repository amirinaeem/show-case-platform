
import { apiSlice } from './apiSlice';
import { MESSENGER_URL } from '../constants'; // Define this constant


export const messengerSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => ({
        url: `${MESSENGER_URL}/friends`,
        method: 'GET'
      }),
      providesTags: ['Friends'],
      transformResponse: (response) => {
        console.log('API Response:', response); // Log the response
        return response.friends || response; // Handle both response formats
      } 
    }),
      
  }),
});

export const { useGetFriendsQuery } = messengerSlice;