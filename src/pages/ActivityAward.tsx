import React from "react";
import { FaArrowLeft, FaRupeeSign, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const tasks = [
  {
    type: "Weekly",
    title: "Lottery betting tasks",
    current: 0,
    target: 50000,
    reward: 100,
  },
];

const dailyMissions = [
  { target: 500, reward: 2 },
  { target: 5000, reward: 20 },
  { target: 50000, reward: 200 },
  { target: 100000, reward: 500 },
];

const ActivityAward = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-white min-h-screen text-[#1D1D1F]">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-400 to-orange-300 p-4 text-white">
        <div className="flex items-center space-x-2">
          <FaArrowLeft className="text-xl" onClick={() => navigate(-1)}/>
          <h1 className="text-lg font-semibold">Activity Award</h1>
        </div>
        <div className="flex items-center space-x-1">
          <FaHistory />
          <span className="text-sm">Collection record</span>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-200 to-orange-100 p-4">
        <h2 className="text-lg font-bold">Complete weekly/daily tasks to receive rich rewards</h2>
        <p className="text-sm mt-1">
          Weekly rewards cannot be accumulated to the next week, and daily rewards cannot be
          accumulated to the next day.
        </p>
      </div>

      {/* Weekly Task */}
      <div className="p-4">
        <div className="bg-[#2e2e7d] text-white rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm bg-red-500 px-3 py-1 rounded-lg font-semibold">Weekly Tasks</span>
            <span className="text-sm text-gray-300">Unfinished</span>
          </div>

          {tasks.map((task, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center space-x-2 text-blue-200">
                <img src="https://cdn-icons-png.flaticon.com/512/272/272525.png" className="w-6 h-6" alt="icon" />
                <span>{task.title} </span>
                <span className="text-red-400 ml-auto">
                  {task.current}/{task.target}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-600 rounded mt-2 mb-2">
                <div
                  className="h-2 bg-blue-400 rounded"
                  style={{ width: `${(task.current / task.target) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-yellow-300 text-sm font-medium mb-2">
                <span>Award amount</span>
                <span className="flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {task.reward.toFixed(2)}
                </span>
              </div>
              <button className="w-full text-blue-300 border border-blue-400 py-1.5 rounded-xl font-semibold">
                to complete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Missions */}
      <div className="p-4 space-y-4">
        {dailyMissions.map((mission, idx) => (
          <div key={idx} className="bg-[#2e2e7d] text-white rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm bg-green-500 px-3 py-1 rounded-lg font-semibold">Daily Mission</span>
              <span className="text-sm text-gray-300">Unfinished</span>
            </div>

            <div className="flex items-center space-x-2 text-blue-200">
              <img src="https://cdn-icons-png.flaticon.com/512/272/272525.png" className="w-6 h-6" alt="icon" />
              <span>Daily betting bonus</span>
              <span className="text-red-400 ml-auto">0/{mission.target}</span>
            </div>

            <div className="w-full h-2 bg-gray-600 rounded mt-2 mb-2">
              <div className="h-2 bg-blue-400 rounded" style={{ width: "0%" }}></div>
            </div>

            <div className="flex justify-between text-yellow-300 text-sm font-medium mb-2">
              <span>Award amount</span>
              <span className="flex items-center">
                <FaRupeeSign className="mr-1" />
                {mission.reward.toFixed(2)}
              </span>
            </div>
            <button className="w-full text-blue-300 border border-blue-400 py-1.5 rounded-xl font-semibold">
              to complete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityAward;
