import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMyShop } from '../api/shopApi.js';
import { setMyShopData } from '../redux/ownerSlice.js';

//* Custom hook to get my shop
const useGetMyShop = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await getMyShop();
        dispatch(setMyShopData(response.shop));
      } catch {
        console.log('Network error occurred. Please try again.');
      }
    };

    fetchShop();
  }, []);
};

export default useGetMyShop;
