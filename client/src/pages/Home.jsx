import { useSelector } from 'react-redux';
import OwnerDashboard from '../components/OwnerDashboard';
import UserDashboard from '../components/UserDashboard';
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard';

const Home = () => {
  const { userData } = useSelector(state => state.user);

  return (
    <div className="w-[100vw] min-h-[100vh] flex flex-col items-center bg-[#fff9f6]">
      {userData?.role === 'owner' && <OwnerDashboard />}
      {userData?.role === 'user' && <UserDashboard />}
      {userData?.role === 'deliveryBoy' && <DeliveryBoyDashboard />}
    </div>
  );
};

export default Home;
