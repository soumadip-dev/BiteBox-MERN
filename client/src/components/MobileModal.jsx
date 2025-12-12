import { useState } from 'react';

const MobileModal = function ({ isOpen, onClose, onSubmit, initialRole }) {
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState(initialRole || 'user');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Basic validation
    if (!mobile.trim()) {
      setError('Mobile number is required');
      return;
    }

    if (!/^\d{10,15}$/.test(mobile)) {
      setError('Please enter a valid mobile number');
      return;
    }

    setError('');
    onSubmit(mobile, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Additional Information Required</h2>
        <p className="text-gray-600 mb-4">
          Please provide your mobile number and select your role to continue with Google Sign Up.
        </p>

        <div className="mb-4">
          <label htmlFor="mobile" className="block text-gray-700 font-medium mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
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
                        backgroundColor: '#ff4d2d',
                        color: 'white',
                        border: '1px solid #ff4d2d',
                      }
                    : { border: '1px solid #ddd', color: '#ff4d2d' }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileModal;
