import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: {
    lat: null,
    lon: null,
  },
  address: null,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setLoaction: (state, action) => {
      const { lat, lon } = action.payload;
      state.location.lat = lat;
      state.location.lon = lon;
    },
    setAddressForDelivery: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setLoaction, setAddressForDelivery } = mapSlice.actions;
export default mapSlice.reducer;




