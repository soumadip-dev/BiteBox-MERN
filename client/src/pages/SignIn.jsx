import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { googleAuth, loginUser } from '../api/authApi';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import toast from 'react-hot-toast';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: 'soumadipmajila@gmail.com',
    password: '8Uh9M96cZq$',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const themeColors = {
    primary: '#ff4d2d',
    hover: '#e64323',
    background: '#fff9f6',
    border: '#ddd',
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSignin = async function () {
    const { email, password } = formData;

    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      dispatch(setUserData(response.user));
      toast.success(response.message);
      setFormData({ email: '', password: '' });
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignin = async function () {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const response = await googleAuth({
        email: result.user?.email,
      });
      if (response.success) {
        toast.success(response.message);
        dispatch(setUserData(response.user));
        setFormData({ email: '', password: '' });
      } else {
        toast.error("You don't have an account. Please sign up first.");
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 w-full"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex w-full max-w-5xl">
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                BiteBox
              </h1>
            </div>
            <p className="text-gray-600">Welcome back! Sign in to continue your food journey.</p>
          </div>

          {['email', 'password'].map(field => (
            <div className="mb-5 relative" key={field}>
              <label htmlFor={field} className="block text-gray-700 font-medium mb-2 capitalize">
                {field}
              </label>
              <div className="relative">
                <input
                  type={field === 'password' ? (showPassword ? 'text' : 'password') : 'email'}
                  id={field}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                  placeholder={`Enter your ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                  style={{
                    border: `1px solid ${themeColors.border}`,
                    paddingRight: field === 'password' ? '3rem' : '1rem',
                  }}
                />
                {field === 'password' && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm font-medium hover:underline"
              style={{ color: themeColors.primary }}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            className="w-full text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: themeColors.primary }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.hover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.primary)}
            onClick={handleSignin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="flex-grow border-t" style={{ borderColor: themeColors.border }}></div>
            <span className="mx-4 text-gray-500 text-sm bg-white px-2">or continue with</span>
            <div className="flex-grow border-t" style={{ borderColor: themeColors.border }}></div>
          </div>

          <button
            className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 border shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-50"
            onClick={handleGoogleSignin}
          >
            <FcGoogle size={22} />
            <span className="font-medium">Sign in with Google</span>
          </button>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold hover:underline"
              style={{ color: themeColors.primary }}
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80")',
              backgroundPosition: 'center 30%',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 77, 45, 0.15) 0%, rgba(255, 77, 45, 0.05) 100%)',
              }}
            ></div>
          </div>

          <div className="relative z-10 p-8 flex flex-col justify-end h-full text-white">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-3">Delicious Indian Cuisine Awaits</h2>
              <p className="text-white/90 mb-4">
                From spicy curries to delicious biryanis, experience the authentic taste of India
                delivered to your doorstep.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 overflow-hidden"
                    >
                      <img
                        src={`https://plus.unsplash.com/premium_photo-1682089787056-9ac0c78a2ac2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium">Join 10,000+ happy customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
