import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineCasino, MdSportsSoccer, MdLocalMovies } from 'react-icons/md';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { GiCardPlay } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const RebatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-gray-800 px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <FaArrowLeft onClick={() => navigate(-1)} className="text-2xl text-gray-800 cursor-pointer" />
        <h1 className="text-lg font-semibold text-gray-800">Rebate</h1>
        <button className="text-sm text-blue-600">Collection record</button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { name: 'All', icon: <BsGrid3X3Gap /> },
          { name: 'Lottery', icon: <GiCardPlay /> },
          { name: 'Casino', icon: <MdOutlineCasino /> },
          { name: 'Sports', icon: <MdSportsSoccer /> },
          { name: 'Rummy', icon: <MdLocalMovies /> },
        ].map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
              index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>

      {/* Rebate Info Card */}
      <div className="bg-gray-100 rounded-xl p-4 mb-5 shadow">
        <div className="text-2xl font-bold text-blue-600 mb-2">₹43.27</div>
        <p className="text-sm text-gray-600 mb-3">Upgrade VIP level to increase rebate rate</p>

        <div className="flex justify-between text-sm text-gray-700 mb-3">
          <div>
            <p className="font-semibold">Today rebate</p>
            <p className="text-blue-600">₹0</p>
          </div>
          <div>
            <p className="font-semibold">Total rebate</p>
            <p className="text-blue-600">₹0.63</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3">Automatic code washing at 01:00 every morning</p>

        <button className="w-full bg-gray-700 text-white py-2 rounded-lg text-sm font-medium">
          One-Click Rebate
        </button>
      </div>

      {/* Rebate History Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Rebate History</h2>

        <div className="bg-gray-100 rounded-xl p-4 mb-4 shadow">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Slots</span>
            <span className="text-green-500">Completed</span>
          </div>
          <p className="text-xs text-gray-500">2025-04-01 01:00:08</p>

          <div className="mt-2 text-sm">
            <div className="flex justify-between">
              <span>🎰 Betting rebate</span>
              <span className="text-blue-600">₹631.36</span>
            </div>
            <div className="flex justify-between">
              <span>📈 Rebate rate</span>
              <span className="text-red-500">0.1%</span>
            </div>
            <div className="flex justify-between">
              <span>💰 Rebate amount</span>
              <span className="text-blue-600">₹0.63</span>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full mt-2 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-semibold">
        All history
      </button>
    </div>
  );
};

export default RebatePage;
