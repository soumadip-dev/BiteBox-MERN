import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getItemByCity } from '../api/shopApi.js';
import { setItemsInMyCity } from '../redux/userSlice.js';

//* Custom hook to get all shops in the user's city
const useGetItemByCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector(state => state.user);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getItemByCity(city);
        dispatch(setItemsInMyCity(response.items));
      } catch {
        console.error('Network error occurred. Please try again.');
      }
    };

    fetchShops();
  }, [city]);
};

export default useGetItemByCity;
