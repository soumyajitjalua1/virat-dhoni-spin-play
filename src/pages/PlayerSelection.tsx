// PlayerSelection.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/AppHeader';

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
  
  // List of top Indian batsmen with their images
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

  return (
    <div className="min-h-screen pb-6 bg-gray-100">
      <AppHeader />
      
      <div className="p-4">
        <Link to="/card-game" className="text-game-primary font-medium flex items-center mb-4">
          ← Back to Game
        </Link>
        
        <h1 className="text-2xl font-bold text-center mb-4">Select Players</h1>
        
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredPlayers.map(player => (
            <div key={player.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`${player.color} p-2 text-center text-white font-medium`}>
                {player.name}
              </div>
              <div className="bg-white p-3 flex items-center justify-center">
                <img 
                  src={player.image}
                  alt={player.name}
                  className="h-28 object-contain"
                />
              </div>
              <div className="p-2 flex items-center justify-between bg-gray-50">
                <span className="text-xs text-gray-500">{player.team}</span>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => selectPlayer(player, 'left')}
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    Left
                  </Button>
                  <Button 
                    onClick={() => selectPlayer(player, 'right')}
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-xs"
                  >
                    Right
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelection;