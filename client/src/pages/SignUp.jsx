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
      </div>
    </div>
  );
};

export default SignUp;
