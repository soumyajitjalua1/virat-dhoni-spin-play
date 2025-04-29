
import React from 'react';

const WinnerDisplay = () => {
  // Placeholder data - will be replaced with real data from Supabase
  const winners = [
    { id: 1, name: 'User123', amount: 5000 },
    { id: 2, name: 'Player456', amount: 10000 },
    { id: 3, name: 'Gamer789', amount: 7500 },
    { id: 3, name: 'Gamer789', amount: 7500 },
    { id: 3, name: 'Gamer789', amount: 7500 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3 text-game-primary">Recent Winners</h2>
      <div className="space-y-2">
        {winners.map((winner) => (
          <div
            key={winner.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded animate-fade-in"
          >
            <span className="text-sm text-gray-600">{winner.name}</span>
            <span className="text-sm font-semibold text-green-600">₹{winner.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnerDisplay;
