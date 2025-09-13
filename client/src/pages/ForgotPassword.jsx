import { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#FFF9F6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d2d] "
            onClick={() => navigate('/')}
          />
          <h1 className="text-[#ff4d2d] text-2xl font-bold text-center">Forgot Password</h1>
        </div>
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full  rounded-lg px-3 py-2 focus:outline-none border-[1px] border-[#ddd]"
                placeholder="Enter your email"
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button
              className="w-full text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: '#ff4d2d' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e64323')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff4d2d')}
            >
              Send OTP
            </button>
          </div>
        )}
        {step === 2 && <div className="">Step 2</div>}
        {step === 3 && <div className="">Step 3</div>}
      </div>
    </div>
  );
};

export default ForgotPassword;
