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

const App = () => {
  useGetCurrentUser();
  useGetLocation();
  useGetMyShop();
  useGetShopByCity();
  useGetItemByCity();
  const { userData } = useSelector(state => state.user);
  return (
    <>
      <Toaster />
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
      </Routes>
    </>
  );
};

export default App;
