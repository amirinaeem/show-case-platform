import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

// Get cart from localStorage or initialize an empty cart
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], billingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        
        return; 
      } else {
        
        state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
      }

     return updateCart(state)
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state)
    },
    saveBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
      return updateCart(state)
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state)
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state)
    }
  },
});

export const { addToCart, removeFromCart, saveBillingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;