// store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import { messagingApiSlice } from "./slices/messagingApiSlice"; // Import your messaging API slice
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [messagingApiSlice.reducerPath]: messagingApiSlice.reducer, // Add messaging reducer
        cart: cartSliceReducer,
        auth: authSliceReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(messagingApiSlice.middleware), // Add messaging middleware
    devTools: true,
});

export default store;