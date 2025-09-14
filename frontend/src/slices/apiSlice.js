// frontend/src/slices/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants'; // BASE_URL should be '' (empty) for CRA proxy

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,          // '' in dev, so requests go to http://localhost:3000 + proxy
    credentials: 'include',     // <-- send httpOnly cookie to backend
  }),
  tagTypes: ['User', 'Users', 'Application', 'Friends', 'Messages'],
  endpoints: () => ({}),
});
