import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/userApi';

//* Custom hook to get the current user
const useGetCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.user);
        } else {
          setError(response.message || 'Failed to fetch user');
        }
      } catch {
        setError('Network error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useGetCurrentUser;
