
import React from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  title: string;
  image: string;
  path: string;
}

const GameCard = ({ title, image, path }: GameCardProps) => {
  return (
    <Link to={path} className="game-card">
      <div className="relative h-32">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-2 left-2 text-white font-medium text-sm">{title}</h3>
      </div>
    </Link>
  );
};

export default GameCard;
