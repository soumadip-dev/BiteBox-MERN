import { createSlice } from '@reduxjs/toolkit';

//* Initial state for user
const initialState = {
  myShopData: null,
};

//* Create a Redux slice for user
export const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
    },
  },
});

//* Export actions and reducer
export const { setMyShopData } = ownerSlice.actions;
export default ownerSlice.reducer;
