import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import ownerReducer from './ownerSlice.js';
import mapReducer from './mapSlice.js';

//* Configure the Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
    owner: ownerReducer,
    map: mapReducer,
  },
  
});
