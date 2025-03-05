import { createSlice } from '@reduxjs/toolkit';

// Helper function to format numbers to 2 decimal places
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Get cart from localStorage or initialize an empty cart
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], itemsPrice: 0, taxPrice: 0, totalPrice: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      // Check if the item already exists in the cart
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If the item already exists, do not add it again
        return; // Exit the function without modifying the state
      } else {
        // If the item doesn't exist, add it to the cart with a fixed quantity of 1
        state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
      }

      // Calculate the items price
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );

      // Calculate the tax price (15% tax)
      state.taxPrice = addDecimals(
        Number((0.15 * state.itemsPrice).toFixed(2))
      );

      // Calculate the total price
      state.totalPrice = (
        Number(state.itemsPrice) + Number(state.taxPrice)
      ).toFixed(2);

      // Save the cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;