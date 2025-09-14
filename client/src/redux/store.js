import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';

//* Configure the Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
