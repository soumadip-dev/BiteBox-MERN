import { useDispatch } from 'react-redux';
import { setAddress, setCity, setState } from '../redux/userSlice.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setAddressForDelivery, setLocation } from '../redux/mapSlice.js';

//* Custom hook to get and store user's current city
const useGetLocation = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCity = async (latitude, longitude) => {
      dispatch(setLocation({ lat: latitude, lon: longitude }));
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching city:', error);
        setLoading(false);
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
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, [dispatch]);

  return { loading };
};

export default useGetLocation;
