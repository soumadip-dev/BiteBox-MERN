import { useState, useRef } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(3);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Add refs for OTP inputs
  const inputRefs = useRef([]);

  // Function to handle OTP input
  const handleOtpInput = function (e, index) {
    const value = e.target.value; // Get the entered value
    // Check if value exists and index is less then 5 (OTP length) -> Not the last box
    if (value && index < 5) {
      // If both true focus to next input
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Function to handle Backspace navigation
  const handleOtpKeyDown = function (e, index) {
    // Check if Backspace key is pressed and index is greater then 0 -> Not the first box
    if (e.key == 'Backspace' && !e.target.value && index > 0) {
      // If both true focus to previous input
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Function to handle Paste OTP
  const handleOtpPaste = function (e) {
    e.preventDefault(); //Prevents default paste behavior
    const pasteData = e.clipboardData.getData('text').trim(); // Get the pasted data
    const pasteDataArray = pasteData.split(''); // Converts string to array of characters

    // Loop through each character and fills corrosponding input box
    pasteDataArray.forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char; // set the value of input box
    });

    // Focus on last input box
    const lastIndex = Math.min(pasteDataArray.length, inputRefs.current.length) - 1;
    if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#FFF9F6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            onClick={() => navigate('/')}
            className="cursor-pointer text-[#ff4d2d] "
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
        {step === 2 && (
          <div>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-700 font-medium mb-3">
                Enter OTP
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to your email
              </p>

              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      type="text"
                      maxLength={1} // Only allows 1 character per box
                      key={index} // Unique identifier for React (0, 1, 2, 3, 4, 5)
                      required // Makes all inputs mandatory
                      className="w-12 h-12 bg-gray-50 text-gray-800 text-xl text-center rounded-lg border border-gray-300 focus:border-[#ff4d2d] focus:ring-2 focus:ring-orange-100 outline-none transition-colors"
                      ref={el => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      onInput={e => handleOtpInput(e, index)} // Function to handle input
                      onKeyDown={e => handleOtpKeyDown(e, index)} // Function to handle keydown
                    />
                  ))}
              </div>
            </div>

            <button
              className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: '#ff4d2d' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e64323')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff4d2d')}
              onClick={() => {
                // Collect OTP from all inputs
                const otpArray = inputRefs.current.map(input => input?.value || '');
                setOtp(otpArray.join(''));
                setStep(3);
              }}
            >
              Verify OTP
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="mb-6 relative">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">
                New Password
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="w-full rounded-lg px-3 py-2 focus:outline-none border-[1px] border-[#ddd] pr-10"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            <div className="mb-6 relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full rounded-lg px-3 py-2 focus:outline-none border-[1px] border-[#ddd] pr-10"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            <button
              className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: '#ff4d2d' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e64323')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff4d2d')}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
