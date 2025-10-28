import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/signUp';
import ForgotPassword from './pages/ForgotPassword';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import useGetCityState from './hooks/useGetCityState';
import { Toaster } from 'react-hot-toast';
import useGetMyShop from './hooks/useGetMyShop';
import CreateEditShop from './pages/CreateEditShop';

const App = () => {
  useGetCurrentUser();
  useGetCityState();
  useGetMyShop();
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
      </Routes>
    </>
  );
};

export default App;
