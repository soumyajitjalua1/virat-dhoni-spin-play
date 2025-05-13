import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CommissionDetails: React.FC = () => {
  const navigate = useNavigate();

  // Dummy data – replace with real API data
  const commissionData = [
    { date: '2025-05-13', source: 'Level 1 Subordinate', amount: 120, status: 'Credited' },
    { date: '2025-05-12', source: 'Level 2 Subordinate', amount: 90, status: 'Credited' },
    { date: '2025-05-11', source: 'Level 1 Subordinate', amount: 150, status: 'Credited' },
    { date: '2025-05-10', source: 'Level 3 Subordinate', amount: 60, status: 'Credited' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-6">
      {/* Back */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 font-medium hover:underline"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Commission Details
      </h1>

      {/* Commission Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Total Commission</p>
          <p className="text-blue-700 text-2xl font-semibold">₹420</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">This Week's Commission</p>
          <p className="text-blue-700 text-2xl font-semibold">₹210</p>
        </div>
      </div>

      {/* Commission Table */}
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Commission History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Source</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {commissionData.map((item, idx) => (
                <tr key={idx} className="even:bg-blue-50">
                  <td className="p-2 border text-gray-700">{item.date}</td>
                  <td className="p-2 border text-gray-700">{item.source}</td>
                  <td className="p-2 border text-green-600 font-medium">₹{item.amount}</td>
                  <td className="p-2 border text-gray-600">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionDetails;
