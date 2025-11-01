import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShopByCity } from '../api/shopApi.js';
import { setShopsInMyCity } from '../redux/userSlice.js';

//* Custom hook to get all shops in the user's city
const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector(state => state.user);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getShopByCity(city);
        dispatch(setShopsInMyCity(response.shops));
      } catch {
        console.log('Network error occurred. Please try again.');
      }
    };

    fetchShops();
  }, [city]);
};

export default useGetShopByCity;
