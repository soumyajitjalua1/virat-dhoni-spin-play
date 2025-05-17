
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedGames = () => {
  return (
    <div className="grid grid-cols-2 gap-3 px-2 py-3">
      <Link to="/guess-player-game" className="relative rounded-lg overflow-hidden shadow-lg">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center space-x-[-30px]">
            <img 
              src="https://documents.iplt20.com/ipl/IPLHeadshot2025/2.png" 
              alt="Virat" 
              className="h-28 w-auto relative z-10 transform -rotate-6"
            />
            <span className="text-white font-bold text-2xl mx-1 relative z-20">VS</span>
            <img 
              src="https://i.pinimg.com/236x/08/d1/bd/08d1bd467b5e3b22d44b07df0dc173c2.jpg" 
              alt="Dhoni" 
              className="h-28 w-auto relative z-10 transform rotate-6" 
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center">
            <p className="text-white font-bold text-sm">Virat vs Dhoni</p>
            <p className="text-game-accent text-xs">Card Game</p>
          </div>
        </div>
      </Link>
      
      <Link to="/wheel-spin" className="relative rounded-lg overflow-hidden shadow-lg">
        <div className="h-32 bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-dashed border-game-accent animate-spin-slow">
              <div className="w-20 h-20 bg-game-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-base">SPIN</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center">
            <p className="text-white font-bold text-sm">Wheel of Fortune</p>
            <p className="text-game-accent text-xs">Spin & Win</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedGames;
