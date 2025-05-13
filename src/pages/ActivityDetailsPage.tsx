import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ActivityDetailsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Header */}
      <div className="bg-[#067FD0] flex items-center justify-between px-4 py-3 shadow">
        <FaArrowLeft onClick={() => navigate(-1)} className="text-lg text-gray-800 cursor-pointer" />
        <h1 className="text-lg font-semibold text-gray-900">Activity Details</h1>
        <span className="w-6" /> {/* Spacer */}
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-5 rounded-b-2xl">
        <h2 className="text-xl font-bold">First Gift</h2>
        <p className="mt-2 text-sm">There are two types of new member gift package rewards:</p>
        <ul className="list-decimal ml-5 mt-1 text-sm">
          <li>Bonus for first deposit negative profit</li>
          <li>Play games and get bonuses only for new members</li>
        </ul>
        <button className="mt-3 px-4 py-1 border border-white text-white text-xs rounded-full">Activity details</button>
      </div>

      {/* Event Start Time */}
      <div className="bg-gray-100 text-center mt-5 mx-4 p-3 rounded-xl shadow text-sm">
        <span className="block text-gray-600 font-medium">Event start time</span>
        <span className="text-red-600 font-semibold text-base">2024-06-06 00:00:00</span>
      </div>

      {/* Table */}
      <div className="bg-gray-100 mt-4 mx-4 rounded-xl shadow overflow-hidden">
        <div className="grid grid-cols-3 bg-blue-500 text-white text-center font-semibold text-sm py-2">
          <div>Conditions of Participation</div>
          <div>Get Compensation Bonus</div>
          <div>Bonus Limit</div>
        </div>
        <div className="grid grid-cols-3 text-center text-sm text-gray-700 bg-white py-3 border-t">
          <div>First deposit for new users</div>
          <div><span className="text-red-500 font-semibold">30%</span> compensation from First Deposit Amount</div>
          <div className="text-red-600 font-semibold">₹200.00</div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-6">
        <button
          disabled
          className="bg-gray-300 text-gray-600 px-6 py-2 rounded-full font-medium cursor-not-allowed shadow-inner"
        >
          Application successful
        </button>
      </div>
    </div>
  );
};

export default ActivityDetailsPage;
