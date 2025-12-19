import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyShop } from '../api/shopApi.js';
import { setMyShopData } from '../redux/ownerSlice.js';

//* Custom hook to get my shop
const useGetMyShop = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      // Only fetch if user is logged in and has a role (owner)
      if (!userData || userData.role !== 'owner') {
        setLoading(false);
        return;
      }

      try {
        const response = await getMyShop();
        dispatch(setMyShopData(response.shop));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shop:', error);
        setLoading(false);
      }
    };

    fetchShop();
  }, [dispatch, userData]); // Add userData as dependency

  return { loading };
};

export default useGetMyShop;
