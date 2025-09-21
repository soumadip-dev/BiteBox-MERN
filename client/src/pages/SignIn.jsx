import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { googleAuth, loginUser } from '../api/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: 'soumadipmajila@gmail.com',
    password: '8Uh9M96cZq$',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      toast.success(response.message);
      setFormData({ email: '', password: '' });
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //* Function for Google authentication
  const handleGoogleSignin = async function () {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const response = await googleAuth({
        email: result.user?.email,
      });
      if (response.success) {
        toast.success(response.message);
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
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${themeColors.border}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.primary }}>
          BiteBox
        </h1>
        <p className="text-gray-600 mb-8">Sign in to continue.</p>

        {/* Input Fields */}
        {['email', 'password'].map(field => (
          <div className="mb-4 relative" key={field}>
            <label htmlFor={field} className="block text-gray-700 font-medium mb-1 capitalize">
              {field}
            </label>
            <input
              type={field === 'password' ? (showPassword ? 'text' : 'password') : 'email'}
              id={field}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder={`Enter your ${field}`}
              value={formData[field]}
              onChange={handleChange}
              style={{ border: `1px solid ${themeColors.border}` }}
            />
            {field === 'password' && (
              <button
                type="button"
                className="absolute right-3 top-[38px] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
              </button>
            )}
          </div>
        ))}

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          className="w-full text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: themeColors.primary }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.hover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.primary)}
          onClick={handleSignin}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Google Sign In */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition duration-200 border border-gray-200 cursor-pointer hover:bg-gray-100"
          onClick={handleGoogleSignin}
        >
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        {/* No account yet */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-orange-500 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
