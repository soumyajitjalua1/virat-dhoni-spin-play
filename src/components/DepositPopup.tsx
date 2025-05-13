import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DepositPopupProps {
  onClose: () => void;
}

const DepositPopup: React.FC<DepositPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleDeposit = () => {
    navigate('/home'); // adjust to your home route
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-[#2D3E9D] text-white rounded-2xl w-full max-w-sm p-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-center mb-2">Extra first deposit bonus</h2>
        <p className="text-xs text-center mb-4">Each account can only receive rewards once</p>

        {[
          { amount: 100000, bonus: 800 },
          { amount: 50000, bonus: 500 },
          { amount: 10000, bonus: 200 },
        ].map(({ amount, bonus }) => (
          <div key={amount} className="bg-[#1C2A7D] rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>First deposit <span className="text-yellow-400">{amount}</span></span>
              <span className="text-orange-400">+ ₹{bonus}.00</span>
            </div>
            <p className="text-xs mt-2">Deposit {amount} for the first time and you will receive {bonus} bonus</p>
            <div className="w-full bg-[#162269] rounded-full mt-2">
              <div className="w-0 bg-white text-black text-center rounded-full text-xs py-1">0/{amount}</div>
            </div>
            <button onClick={handleDeposit} className="mt-2 w-full bg-yellow-400 text-black py-1 rounded-md font-semibold">
              Deposit
            </button>
          </div>
        ))}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default DepositPopup;
