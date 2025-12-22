import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <div className="max-w-lg w-full text-center">
        <div className="relative mb-8">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-5xl transform hover:scale-110 transition-transform duration-300">
              🚫
            </div>
            <div className="text-8xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              404
            </div>
            <div className="text-5xl transform hover:scale-110 transition-transform duration-300">
              🔍
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
            <div
              className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-4 h-4 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops! Lost your way?</h1>
          <p className="text-gray-600 text-lg mb-4 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Let's get you back to familiar territory where the good stuff is!
          </p>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center shadow-lg border border-orange-200">
                <div className="text-4xl transform hover:scale-110 transition-transform duration-300">
                  🧭
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-white text-sm">📍</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 max-w-xs mx-auto bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-orange-200 cursor-pointer"
          >
            <IoIosArrowRoundBack size={24} />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 max-w-xs mx-auto bg-white text-orange-600 py-4 px-8 rounded-xl font-semibold text-lg border border-orange-200 hover:bg-orange-50 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-orange-100 cursor-pointer"
          >
            <span className="text-xl">🏠</span>
            <span>Go Home</span>
          </button>
        </div>

        <div className="mt-12">
          <p className="text-gray-400 text-sm">
            Can't find what you're looking for? Contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
