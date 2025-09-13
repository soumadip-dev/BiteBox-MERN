import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');

  const themeColors = {
    primary: '#ff4d2d',
    hover: '#e64323',
    background: '#fff9f6',
    border: '#ddd',
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

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your full name"
            style={{ border: `1px solid ${themeColors.border}` }}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your email"
            style={{ border: `1px solid ${themeColors.border}` }}
          />
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          <label htmlFor="mobile" className="block text-gray-700 font-medium mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your mobile number"
            style={{ border: `1px solid ${themeColors.border}` }}
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your password"
            style={{ border: `1px solid ${themeColors.border}` }}
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
          </button>
        </div>

        {/* Role */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 font-medium mb-1">
            Role
          </label>
          <div className="flex gap-2">
            {['user', 'owner', 'deliveryBoy'].map(r => (
              <button
                key={r}
                type="button"
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role === r
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

        {/* Submit Button */}
        <button
          className="w-full text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
          style={{ backgroundColor: themeColors.primary }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.hover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.primary)}
        >
          Sign Up
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
