import { useDispatch } from 'react-redux';
import { setAddress, setCity, setState } from '../redux/userSlice.js';
import { useEffect } from 'react';
import axios from 'axios';
import { setAddressForDelivery, setLoaction } from '../redux/mapSlice.js';

//* Custom hook to get and store user's current city
const useGetLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCity = async (latitude, longitude) => {
      dispatch(setLoaction({ lat: latitude, lon: longitude }));
      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${
            import.meta.env.VITE_GEOAPI_KEY
          }`
        );
        const city = response.data?.results?.[0]?.city || 'Unknown';
        const state = response.data?.results?.[0]?.state || 'Unknown';
        const address =
          response.data?.results?.[0].address_line2 ||
          response.data?.results?.[0].address_line1 ||
          'Unknown';

        dispatch(setCity(city));
        dispatch(setState(state));
        dispatch(setAddress(address));
        dispatch(setAddressForDelivery(address));
      } catch (error) {
        console.error('Error fetching city:', error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchCity(latitude, longitude);
        },
        error => {
          console.error('Geolocation error:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [dispatch]);
};

export default useGetLocation;
