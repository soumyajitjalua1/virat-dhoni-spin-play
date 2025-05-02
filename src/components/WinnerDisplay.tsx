import React, { useState, useEffect } from 'react';

const WinnerDisplay = () => {
  // Mock data - 25 users with winning amounts
  const allWinners = [
    { id: 1, name: 'User123', amount: 5000 },
    { id: 2, name: 'Player456', amount: 10000 },
    { id: 3, name: 'Gamer789', amount: 7500 },
    { id: 4, name: 'LuckyStar', amount: 15000 },
    { id: 5, name: 'WinMaster', amount: 8200 },
    { id: 6, name: 'FastHand', amount: 6500 },
    { id: 7, name: 'RoyalFlush', amount: 12500 },
    { id: 8, name: 'BigWinner', amount: 20000 },
    { id: 9, name: 'ProPlayer', amount: 9800 },
    { id: 10, name: 'GoldRush', amount: 11200 },
    { id: 11, name: 'SpinMaster', amount: 7200 },
    { id: 12, name: 'LuckyDraw', amount: 6800 },
    { id: 13, name: 'JackpotKing', amount: 18500 },
    { id: 14, name: 'BetWinner', amount: 9200 },
    { id: 15, name: 'FortuneSeeker', amount: 14200 },
    { id: 16, name: 'CasinoRoyal', amount: 16000 },
    { id: 17, name: 'GamePro', amount: 8900 },
    { id: 18, name: 'TopGamer', amount: 7600 },
    { id: 19, name: 'LuckyCharm', amount: 13500 },
    { id: 20, name: 'MegaWin', amount: 25000 },
    { id: 21, name: 'BonusHunter', amount: 10500 },
    { id: 22, name: 'RichPlayer', amount: 17000 },
    { id: 23, name: 'MoneyMaker', amount: 11800 },
    { id: 24, name: 'GoldMiner', amount: 9500 },
    { id: 25, name: 'VIPWinner', amount: 22000 }
  ];

  // State to hold currently displayed winners (5 at a time)
  const [displayedWinners, setDisplayedWinners] = useState(allWinners.slice(0, 5));
  
  // State to track the current index in the rotation
  const [currentIndex, setCurrentIndex] = useState(5);

  // Animation state for the newest winner
  const [animatedWinnerId, setAnimatedWinnerId] = useState(null);

  useEffect(() => {
    // Function to rotate winners by removing the last one and adding a new one at the top
    const rotateWinners = () => {
      // Get the next winner index, cycling back to 0 when we reach the end
      const nextIndex = currentIndex % allWinners.length;
      
      // Create new array by adding the next winner at the top and removing the last element
      const newWinners = [allWinners[nextIndex], ...displayedWinners.slice(0, 4)];
      
      // Set the newly added winner as the animated one
      setAnimatedWinnerId(allWinners[nextIndex].id);
      
      // Update the displayed winners
      setDisplayedWinners(newWinners);
      
      // Increment the current index for the next rotation
      setCurrentIndex(currentIndex + 1);
      
      // Clear animation class after the animation completes
      setTimeout(() => {
        setAnimatedWinnerId(null);
      }, 1000);
    };

    // Set interval to rotate winners every 3-5 seconds (random)
    const interval = setInterval(() => {
      rotateWinners();
    }, Math.floor(Math.random() * 2000) + 3000); // Random between 3000-5000ms

    return () => clearInterval(interval);
  }, [displayedWinners, currentIndex]);

  return (
    <div className="w-full max-w-md mx-auto p-4  rounded-lg shadow-xl">
      <h2 className="text-xl font-bold text-center text-yellow-400 mb-4">Recent Winners</h2>
      
      <div className="space-y-2">
        {displayedWinners.map((winner, index) => (
          <div 
            key={`${winner.id}-${index}`}
            className={`flex justify-between items-center p-3 rounded-md ${
              winner.id === animatedWinnerId 
                ? 'bg-yellow-600 animate-pulse' 
                : 'bg-gray-800'
            } transition-all duration-300`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs text-white">{winner.name.charAt(0)}</span>
              </div>
              <span className="text-white font-medium">{winner.name}</span>
            </div>
            <span className="text-green-400 font-bold">₹{winner.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnerDisplay;