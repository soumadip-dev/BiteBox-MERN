import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { googleAuth, registerUser } from '../api/authApi';
import toast from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import MobileModal from '../components/MobileModal';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
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

  const handleRoleChange = role => {
    setFormData({ ...formData, role });
  };

  const handleSignUp = async () => {
    const { fullName, email, password, mobile, role } = formData;
    if (!fullName || !email || !password || !mobile) {
      toast.error('Please fill all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await registerUser({ fullName, email, password, mobile, role });
      dispatch(setUserData(response.user));
      toast.success(response.message);
      setFormData({ fullName: '', email: '', password: '', mobile: '', role: 'user' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = (mobileNumber, role) => {
    setFormData({ ...formData, mobile: mobileNumber, role });
    setIsMobileModalOpen(false);
    handleGoogleAuthentication(mobileNumber, role);
  };

  const handleGoogleAuthentication = async (mobileNumber, role) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const response = await googleAuth({
        fullName: result.user?.displayName,
        email: result.user?.email,
        mobile: mobileNumber,
        role: role,
      });

      dispatch(setUserData(response.user));
      toast.success(response.message);
      setFormData({ fullName: '', email: '', password: '', mobile: '', role: 'user' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  const handleGoogleSignup = () => {
    setIsMobileModalOpen(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 w-full"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex w-full max-w-5xl my-4">
        {/* Left Side - Image Section */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80")',
              backgroundPosition: 'center 40%',
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

          {/* Overlay Content */}
          <div className="relative z-10 p-8 flex flex-col justify-end h-full text-white">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-3">Join Our Food Community</h2>
              <p className="text-white/90 mb-4">
                Sign up today and get ₹100 off on your first order! Discover amazing Indian
                restaurants near you.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg">🚚</span>
                  </div>
                  <span>Fast delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg">😋</span>
                  </div>
                  <span>Large Variety of Food</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg">⭐</span>
                  </div>
                  <span>24/7 Customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Card */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                BiteBox
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              Create an account to start your delicious food journey.
            </p>
          </div>

          {/* Input Fields - Compact */}
          {['fullName', 'email', 'mobile', 'password'].map(field => (
            <div className="mb-4 relative" key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-1 text-sm capitalize"
              >
                {field === 'mobile' ? 'Mobile Number' : field}
              </label>
              <div className="relative">
                <input
                  type={
                    field === 'password'
                      ? showPassword
                        ? 'text'
                        : 'password'
                      : field === 'email'
                      ? 'email'
                      : field === 'mobile'
                      ? 'tel'
                      : 'text'
                  }
                  id={field}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all duration-200"
                  placeholder={`Enter your ${field === 'mobile' ? 'mobile number' : field}`}
                  value={formData[field]}
                  onChange={handleChange}
                  style={{
                    border: `1px solid ${themeColors.border}`,
                    paddingRight: field === 'password' ? '2.5rem' : '1rem',
                  }}
                />
                {field === 'password' && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Role Selector - Compact */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              I want to join as a
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['user', 'owner', 'deliveryBoy'].map(r => (
                <button
                  key={r}
                  type="button"
                  className="border rounded-lg px-2 py-2 text-center font-medium transition-all duration-200 cursor-pointer hover:shadow-sm text-sm"
                  onClick={() => handleRoleChange(r)}
                  style={
                    formData.role === r
                      ? {
                          backgroundColor: themeColors.primary,
                          color: 'white',
                          border: `1px solid ${themeColors.primary}`,
                        }
                      : {
                          border: `1px solid ${themeColors.border}`,
                          color: themeColors.primary,
                          backgroundColor: 'white',
                        }
                  }
                >
                  {r === 'user' ? 'Food Lover' : r === 'owner' ? 'Restaurant' : 'Delivery'}
                </button>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-5">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 mt-0.5"
                style={{ accentColor: themeColors.primary }}
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="font-medium hover:underline"
                  style={{ color: themeColors.primary }}
                >
                  Terms
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="font-medium hover:underline"
                  style={{ color: themeColors.primary }}
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            className="w-full text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-md cursor-pointer disabled:opacity-50 mb-3 text-sm"
            style={{ backgroundColor: themeColors.primary }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.hover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.primary)}
            onClick={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="flex-grow border-t" style={{ borderColor: themeColors.border }}></div>
            <span className="mx-3 text-gray-500 text-xs bg-white px-2">or sign up with</span>
            <div className="flex-grow border-t" style={{ borderColor: themeColors.border }}></div>
          </div>

          {/* Google Sign Up */}
          <button
            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 transition-all duration-200 border shadow-sm hover:shadow cursor-pointer hover:bg-gray-50 text-sm"
            onClick={handleGoogleSignup}
          >
            <FcGoogle size={18} />
            <span className="font-medium">Sign up with Google</span>
          </button>

          {/* Already have account */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link
              to="/"
              className="font-semibold hover:underline"
              style={{ color: themeColors.primary }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile Modal */}
      <MobileModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialRole={formData.role}
      />
    </div>
  );
};

export default SignUp;
