// store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from './slices/authSlice';
import messengerReducer from './slices/messengerApiSlice'; // Add this

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer,
        messenger: messengerReducer, // Add this
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(apiSlice.middleware),
    devTools: true,
});

export default store;