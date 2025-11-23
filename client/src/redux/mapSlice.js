import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: {
    lat: 20.5937,
    lon: 78.9629,
  },
  address: '',
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      const { lat, lon } = action.payload;
      state.location.lat = lat;
      state.location.lon = lon;
    },
    setAddressForDelivery: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setLocation, setAddressForDelivery } = mapSlice.actions;
export default mapSlice.reducer;
