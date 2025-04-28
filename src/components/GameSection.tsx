
import React from 'react';
import GameCard from './GameCard';

interface GameSectionProps {
  title: string;
  games: {
    title: string;
    image: string;
    path: string;
  }[];
}

const GameSection = ({ title, games }: GameSectionProps) => {
  return (
    <div className="py-3 px-2">
      <h2 className="text-xl font-bold text-game-dark mb-2">{title}</h2>
      <div className="grid grid-cols-3 gap-3">
        {games.map((game, index) => (
          <GameCard 
            key={index}
            title={game.title}
            image={game.image}
            path={game.path}
          />
        ))}
      </div>
    </div>
  );
};

export default GameSection;
