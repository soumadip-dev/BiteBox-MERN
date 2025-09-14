import { createSlice } from '@reduxjs/toolkit';

//* Initial state for user
const initialState = {
  userData: null,
};

//* Create a Redux slice for user
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

//* Export actions and reducer
export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
