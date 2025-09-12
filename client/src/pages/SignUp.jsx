import React from 'react';

const SignUp = () => {
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
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your password"
            style={{ border: `1px solid ${themeColors.border}` }}
          />
        </div>

        {/* Submit Button */}
        <button className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;

{
  /* fullName, email, password, mobile, role */
}
