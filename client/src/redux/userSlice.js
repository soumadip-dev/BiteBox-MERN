import { createSlice } from '@reduxjs/toolkit';

//* Initial state for user
const initialState = {
  userData: null,
  city: null,
  state: null,
  address: null,
  shopsInMyCity: [],
};

//* Create a Redux slice for user
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
  },
});

//* Export actions and reducer
export const { setUserData, setCity, setState, setAddress, setShopsInMyCity } = userSlice.actions;
export default userSlice.reducer;
