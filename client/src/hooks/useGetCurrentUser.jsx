import { useEffect } from 'react';
import { getCurrentUser } from '../api/userApi';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

//* Custom hook to get the current user
const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(setUserData(response.user));
      } catch {
        console.log('Network error occurred. Please try again.');
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
