import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineRuleFolder } from 'react-icons/md';
import { GiStarMedal } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const SuperJackpotPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow">
        <FaArrowLeft onClick={() => navigate(-1)} className="text-lg text-gray-800 cursor-pointer" />
        <h1 className="text-lg font-semibold text-gray-900">Super Jackpot</h1>
        <span className="w-6" /> {/* Spacer */}
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 rounded-b-2xl">
        <h2 className="text-xl font-bold">Super Jackpot</h2>
        <p className="text-sm mt-1">
          When you get the Super Jackpot in <strong>[Slots]</strong>, you can get 1 additional bonus.
        </p>
        <p className="text-xs mt-1 opacity-90">
          The reward is valid for 30 days and will expire if not claimed.
        </p>
      </div>

      {/* Receive in Batches Button */}
      <div className="flex justify-center mt-4">
        <button
          disabled
          className="bg-gray-200 text-gray-500 px-6 py-2 rounded-full font-medium flex items-center gap-2 cursor-not-allowed"
        >
          🎁 Receive in batches
        </button>
      </div>

      {/* Rule & Winning Star */}
      <div className="grid grid-cols-2 gap-4 px-4 mt-5">
        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg shadow">
          <MdOutlineRuleFolder size={20} /> Rule
        </button>
        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg shadow">
          <GiStarMedal size={20} /> Winning Star
        </button>
      </div>

      {/* No Jackpot Message */}
      <div className="bg-gray-100 mt-6 mx-4 rounded-xl flex flex-col items-center justify-center p-6 text-center shadow">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4321/4321086.png"
          alt="no jackpot"
          className="w-20 h-20 mb-3 opacity-70"
        />
        <p className="text-gray-600 text-sm">You don't have a big jackpot yet, let's bet</p>
      </div>

      {/* Go Bet Button */}
      <div className="fixed bottom-4 w-full px-4">
        <button className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold shadow-md hover:bg-blue-700" onClick={() => navigate('/')}>
          Go Bet
        </button>
      </div>
    </div>
  );
};

export default SuperJackpotPage;
