import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  themeMood: '',
  new_user_add: '',
  activeConversation: null
};

const messengerApiSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.themeMood = action.payload.theme;
    },
    setNewUserAdd: (state, action) => {
      state.new_user_add = action.payload.new_user_add;
    },
    clearNewUserAdd: (state) => {
      state.new_user_add = '';
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    }
  }
});

export const { 
  setTheme, 
  setNewUserAdd, 
  clearNewUserAdd,
  setActiveConversation
} = messengerApiSlice.actions;

export default messengerApiSlice.reducer;