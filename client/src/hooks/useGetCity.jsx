import { useDispatch } from 'react-redux';
import { setCity } from '../redux/userSlice.js';
import { useEffect } from 'react';
import axios from 'axios';

//* Custom hook to get and store user's current city
const useGetCity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCity = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${
            import.meta.env.VITE_GEOAPI_KEY
          }`
        );
        const city = response.data?.results?.[0]?.city || 'Unknown';
        dispatch(setCity(city));
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

export default useGetCity;
