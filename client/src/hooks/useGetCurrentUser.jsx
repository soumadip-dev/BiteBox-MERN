import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/userApi';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

//* Custom hook to get the current user
const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(setUserData(response.user));
        setLoading(false);
      } catch {
        console.error('Network error occurred. Please try again.');
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  return { loading };
};

export default useGetCurrentUser;
