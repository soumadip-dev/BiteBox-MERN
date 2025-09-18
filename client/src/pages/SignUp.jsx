import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.success(response.message);
      setFormData({ fullName: '', email: '', password: '', mobile: '', role: 'user' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
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
        <p className="text-gray-600 mb-8">Sign up to start enjoying delicious food deliveries.</p>

        {/* Input Fields */}
        {['fullName', 'email', 'mobile', 'password'].map(field => (
          <div className="mb-4 relative" key={field}>
            <label htmlFor={field} className="block text-gray-700 font-medium mb-1 capitalize">
              {field === 'mobile' ? 'Mobile Number' : field}
            </label>
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
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder={`Enter your ${field === 'mobile' ? 'mobile number' : field}`}
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

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <div className="flex gap-2">
            {['user', 'owner', 'deliveryBoy'].map(r => (
              <button
                key={r}
                type="button"
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => handleRoleChange(r)}
                style={
                  formData.role === r
                    ? {
                        backgroundColor: themeColors.primary,
                        color: 'white',
                        border: `1px solid ${themeColors.primary}`,
                      }
                    : { border: `1px solid ${themeColors.border}`, color: themeColors.primary }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          className="w-full text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: themeColors.primary }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.hover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.primary)}
          onClick={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {/* Google Sign Up */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition duration-200 border border-gray-200 cursor-pointer hover:bg-gray-100">
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        {/* Already have account */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-orange-500 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
