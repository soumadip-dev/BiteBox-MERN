import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/signUp';
import ForgotPassword from './pages/ForgotPassword';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import useGetCity from './hooks/useGetCity';
import { Toaster } from 'react-hot-toast';

const App = () => {
  useGetCurrentUser();
  useGetCity();
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
      </Routes>
    </>
  );
};

export default App;
