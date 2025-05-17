import React from "react";

interface Player {
  name: string;
  img: string;
}

interface GameCardProps {
  player: Player;
  onSelect: () => void;
  disabled: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ player, onSelect, disabled }) => {
  return (
    <div
      className={`w-1/2 cursor-pointer text-center ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      onClick={!disabled ? onSelect : undefined}
    >
      <img
        src={player.img}
        alt={player.name}
        className="rounded-xl mb-2 h-40 object-cover"
      />
      <h2 className="text-lg font-bold">{player.name}</h2>
    </div>
  );
};

export default GameCard;
