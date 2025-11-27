import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMyOrders } from '../redux/userSlice.js';
import { getOrders } from '../api/orderApi.js';

//* Custom hook to get my shop
const useGetMyOrders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        dispatch(setMyOrders(response.orders));
      } catch {
        console.error('Network error occurred. Please try again.');
      }
    };

    fetchOrders();
  }, []);
};

export default useGetMyOrders;
