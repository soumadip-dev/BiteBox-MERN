import { useSelector } from 'react-redux';
import useGetLocation from './useGetLocation';
import useGetCurrentUser from './useGetCurrentUser';

const useInitialLoad = () => {
  const { userData, city } = useSelector(state => state.user);
  const { loading: locationLoading } = useGetLocation();
  const { loading: userLoading } = useGetCurrentUser();

  const isLoading = userLoading || locationLoading || (userData && !city);

  return { isLoading };
};

export default useInitialLoad;
