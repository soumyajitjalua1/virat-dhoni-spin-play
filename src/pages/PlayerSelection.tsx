// PlayerSelection.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/AppHeader';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';

// Interface for player data
interface Player {
  id: number;
  name: string;
  image: string;
  team: string;
  color: string;
}

const PlayerSelection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter players based on search term
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectPlayer = (player: Player, position: 'left' | 'right') => {
    // Store selected player in localStorage
    if (position === 'left') {
      localStorage.setItem('leftPlayer', JSON.stringify(player));
    } else {
      localStorage.setItem('rightPlayer', JSON.stringify(player));
    }
    
    // Navigate back to the game
    navigate('/card-game');
  };

  // Get team background and text colors
  const getTeamStyles = (color: string) => {
    const teamColors: Record<string, { bg: string, border: string, shadow: string }> = {
      'bg-red-600': { bg: 'bg-red-600', border: 'border-red-700', shadow: 'shadow-red-700/50' },
      'bg-yellow-500': { bg: 'bg-yellow-500', border: 'border-yellow-600', shadow: 'shadow-yellow-600/50' },
      'bg-blue-500': { bg: 'bg-blue-500', border: 'border-blue-600', shadow: 'shadow-blue-600/50' },
      'bg-blue-400': { bg: 'bg-blue-400', border: 'border-blue-500', shadow: 'shadow-blue-500/50' },
      'bg-sky-500': { bg: 'bg-sky-500', border: 'border-sky-600', shadow: 'shadow-sky-600/50' },
      'bg-green-500': { bg: 'bg-green-500', border: 'border-green-600', shadow: 'shadow-green-600/50' },
      'bg-green-600': { bg: 'bg-green-600', border: 'border-green-700', shadow: 'shadow-green-700/50' },
      'bg-pink-500': { bg: 'bg-pink-500', border: 'border-pink-600', shadow: 'shadow-pink-600/50' },
      'bg-orange-500': { bg: 'bg-orange-500', border: 'border-orange-600', shadow: 'shadow-orange-600/50' },
      'bg-red-500': { bg: 'bg-red-500', border: 'border-red-600', shadow: 'shadow-red-600/50' },
      'bg-purple-600': { bg: 'bg-purple-600', border: 'border-purple-700', shadow: 'shadow-purple-700/50' },
    };
    
    return teamColors[color] || { bg: 'bg-gray-500', border: 'border-gray-600', shadow: 'shadow-gray-600/50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <AppHeader />
      
      <div className="p-4 max-w-7xl mx-auto">
        <Link to="/card-game" className="text-game-primary font-medium flex items-center mb-4 hover:underline">
          ← Back to Game
        </Link>
        
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Select Your Champion</h1>
        
        <div className="relative mb-6 max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white pl-10 border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl shadow-md h-12"
          />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredPlayers.map(player => {
            const teamStyle = getTeamStyles(player.color);
            
            return (
              <div 
                key={player.id} 
                className={`relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${teamStyle.shadow} shadow-lg border-2 ${teamStyle.border}`}
              >
                {/* Image container - takes full space */}
                <div className={`${teamStyle.bg} w-full pt-4 pb-0 px-0`}>
                  <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center">
                    <img 
                      src={player.image}
                      alt={player.name}
                      className="object-contain w-full h-full"
                    />
                    
                    {/* Directional buttons overlaid directly on image */}
                    <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <Button 
                        onClick={() => selectPlayer(player, 'left')}
                        size="sm" 
                        className="rounded-full h-8 w-8 p-0 bg-blue-600 hover:bg-blue-800 shadow-lg border border-white"
                      >
                        <ArrowLeft size={14} />
                      </Button>
                      <Button 
                        onClick={() => selectPlayer(player, 'right')}
                        size="sm"
                        className="rounded-full h-8 w-8 p-0 bg-yellow-500 hover:bg-yellow-600 shadow-lg border border-white"
                      >
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Player info - colored with team color */}
                <div className={`${teamStyle.bg} w-full py-2 px-2`}>
                  <div className="text-white font-bold text-center text-sm truncate">
                    {player.name}
                  </div>
                  <div className="flex justify-center mt-1">
                    <span className="bg-white bg-opacity-20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {player.team}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Players data - keeping your original data
const players: Player[] = [
  { id: 1, name: 'Virat Kohli', image: '/Virat_Kohli%20.png', team: 'RCB', color: 'bg-red-600' },
  { id: 2, name: 'MS Dhoni', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/57.png', team: 'CSK', color: 'bg-yellow-500' },
  { id: 3, name: 'Rohit Sharma', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/6.png', team: 'MI', color: 'bg-blue-500' },
  { id: 4, name: 'KL Rahul', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/19.png', team: 'DC', color: 'bg-blue-400' },
  { id: 5, name: 'Hardik Pandya', image: 'https://iplwiki.com/wp-content/uploads/1993/10/Hardik-Pandya-300x300.png', team: 'MI', color: 'bg-blue-500' },
  { id: 6, name: 'Jasprit Bumrah', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/9.png', team: 'MI', color: 'bg-blue-500' },
  { id: 7, name: 'Rishabh Pant', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/18.png', team: 'LSG', color: 'bg-sky-500' },
  { id: 8, name: 'Shikhar Dhawan', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/11.png', team: 'PBKS', color: 'bg-red-600' },
  { id: 9, name: 'Ravindra Jadeja', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/46.png', team: 'CSK', color: 'bg-yellow-500' },
  { id: 10, name: 'Suryakumar Yadav', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/174.png', team: 'MI', color: 'bg-blue-500' },
  { id: 11, name: 'Shubman Gill', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/62.png', team: 'GT', color: 'bg-green-500' },
  { id: 12, name: 'Shreyas Iyer', image: 'https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20241124125719.jpg', team: 'PBKS', color: 'bg-red-600' },
  { id: 13, name: 'Yuzvendra Chahal', image: 'https://onecricketnews.akamaized.net/parth-editor/oc-dashboard/news-images-prod/1737915754360_Yuzvendra_Chahal_IPL.jpg?type=mq', team: 'PBKS', color: 'bg-red-500' },
  { id: 14, name: 'Sanju Samson', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/190.png', team: 'RR', color: 'bg-pink-500' },
  { id: 15, name: 'Ishan Kishan', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/164.png', team: 'SRH', color: 'bg-orange-500' },
  { id: 16, name: 'Ruturaj Gaikwad', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/102.png', team: 'CSK', color: 'bg-yellow-500' },
  { id: 17, name: 'Venkatesh Iyer', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/584.png', team: 'KKR', color: 'bg-purple-600' },
  { id: 18, name: 'Mohammed Siraj', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/63.png', team: 'GT', color: 'bg-green-600' },
  { id: 19, name: 'Mayank Agarwal', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/55.png', team: 'SRH', color: 'bg-orange-500' },
  { id: 20, name: 'Arshdeep Singh', image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/125.png', team: 'PBKS', color: 'bg-red-600' }
];

export default PlayerSelection;