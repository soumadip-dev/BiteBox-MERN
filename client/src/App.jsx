import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/signUp';
import ForgotPassword from './pages/ForgotPassword';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import useGetMyShop from './hooks/useGetMyShop';
import CreateEditShop from './pages/CreateEditShop';
import useGetLocation from './hooks/useGetLocation';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import useGetShopByCity from './hooks/useGetShopByCity';
import useGetItemByCity from './hooks/useGetItemByCity';
import CartPage from './pages/CartPage';
import CheckOut from './pages/CheckOut';
import NotFound from './pages/NotFound';
import OrderPlaced from './pages/OrderPlaced';
import MyOrders from './pages/MyOrders';
import useGetMyOrders from './hooks/useGetMyOrders';
import useUpdateLocation from './hooks/useUpdateLocation';
import TrackOrderPage from './pages/TrackOrderPage';
import RestaurantPage from './pages/RestaurantPage';

const App = () => {
  const { loading: userLoading } = useGetCurrentUser();
  const { loading: locationLoading } = useGetLocation();
  const { loading: shopLoading } = useGetMyShop(); // Get shop loading state
  useGetShopByCity();
  useGetItemByCity();
  useGetMyOrders();
  useUpdateLocation();

  const { userData, city } = useSelector(state => state.user);

  // Show loading while fetching user data, location, or shop data
  const isLoading =
    userLoading ||
    locationLoading ||
    (userData?.role === 'owner' && shopLoading) ||
    (userData && !city);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff9f6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4d2d] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
        />
        <Route path="/" element={userData ? <Home /> : <SignIn />} />
        <Route path="/create-edit-shop" element={userData ? <CreateEditShop /> : <SignIn />} />
        <Route path="/add-food" element={userData ? <AddItem /> : <SignIn />} />
        <Route path="/edit-food/:itemId" element={userData ? <EditItem /> : <SignIn />} />
        <Route path="/cart" element={userData ? <CartPage /> : <SignIn />} />
        <Route path="/checkout" element={userData ? <CheckOut /> : <SignIn />} />
        <Route path="/order-placed" element={userData ? <OrderPlaced /> : <SignIn />} />
        <Route path="/my-orders" element={userData ? <MyOrders /> : <SignIn />} />
        <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage /> : <SignIn />} />
        <Route
          path="/restaurant/:restaurantId"
          element={userData ? <RestaurantPage /> : <SignIn />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
