import { useState, useRef } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword, sendPasswordResetEmail, verifyPasswordResetOtp } from '../api/authApi';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step controller: 1 = Email, 2 = OTP, 3 = Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // References for OTP input fields
  const inputRefs = useRef([]);

  // Handle OTP input navigation
  const handleOtpInput = function (e, index) {
    const value = e.target.value; // Get the entered value
    // If a value is entered and this is not the last box, move focus to the next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation in OTP fields
  const handleOtpKeyDown = function (e, index) {
    // If Backspace is pressed on an empty field and not the first box, move focus back
    if (e.key == 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting of OTP into the boxes
  const handleOtpPaste = function (e) {
    e.preventDefault(); // Prevent default paste behavior
    const pasteData = e.clipboardData.getData('text').trim(); // Get the pasted string
    const pasteDataArray = pasteData.split(''); // Convert string into an array of characters

    // Loop through each character and fill the corresponding input box
    pasteDataArray.forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char;
    });

    // Focus on the last filled input box
    const lastIndex = Math.min(pasteDataArray.length, inputRefs.current.length) - 1;
    if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();
  };

  //* Handle send OTP to email
  const handleSendOtp = async function (email) {
    if (!email) return toast.error('Please enter your email.');
    setIsLoading(true);

    try {
      const response = await sendPasswordResetEmail(email);
      if (response.success) {
        toast.success(response.message);
        setStep(2);
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Network error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //* Handle Verify OTP
  const handleVerifyOtp = async function ({ email, otp }) {
    if (!email) return toast.error('Please enter your email.');
    if (otp.length !== 6) return toast.error('Please enter a valid OTP.');
    setIsLoading(true);
    try {
      const response = await verifyPasswordResetOtp({ email, otp });
      if (response.success) {
        toast.success(response.message);
        setStep(3);
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Network error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //* Handle Reset Password
  const handleResetPassword = async function ({ email, newPassword }) {
    if (!email) return toast.error('Please enter your email.');
    if (!newPassword) return toast.error('Please enter a new password.');

    setIsLoading(true);
    try {
      const response = await resetPassword({ email, newPassword });
      if (response.success) {
        toast.success(response.message);
        navigate('/');
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Network error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#FFF9F6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            onClick={() => navigate('/')}
            className="cursor-pointer text-[#ff4d2d] "
          />
          <h1 className="text-[#ff4d2d] text-2xl font-bold text-center">Forgot Password</h1>
        </div>
        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg px-3 py-2 focus:outline-none border-[1px] border-[#ddd]"
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
              onClick={() => handleSendOtp(email)}
              disabled={isLoading}
            >
              Send OTP
            </button>
          </div>
        )}
        {/* Step 2: Verify OTP */}
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
                      maxLength={1} // Only allow 1 character per box
                      key={index} // Unique key for each box
                      required // Make each input mandatory
                      className="w-12 h-12 bg-gray-50 text-gray-800 text-xl text-center rounded-lg border border-gray-300 focus:border-[#ff4d2d] focus:ring-2 focus:ring-orange-100 outline-none transition-colors"
                      ref={el => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      onInput={e => handleOtpInput(e, index)}
                      onKeyDown={e => handleOtpKeyDown(e, index)}
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
                // Collect OTP from all inputs and move to reset password step
                const otpArray = inputRefs.current.map(input => input?.value || '');
                handleVerifyOtp({ email, otp: otpArray.join('') });
              }}
              disabled={isLoading}
            >
              Verify OTP
            </button>
          </div>
        )}
        {/* Step 3: Reset Password */}

        {step === 3 && (
          <div>
            {/* New Password Input */}
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

            {/* Confirm Password Input */}
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
              onClick={async () => {
                // Validate passwords
                if (!newPassword) {
                  return toast.error('Please enter a new password.');
                }
                if (newPassword.length < 6) {
                  return toast.error('Password must be at least 6 characters long.');
                }
                if (newPassword !== confirmPassword) {
                  return toast.error('Passwords do not match.');
                }

                handleResetPassword({ email, newPassword });
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
