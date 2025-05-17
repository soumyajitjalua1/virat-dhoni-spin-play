// pages/GameList.tsx
import React from 'react';
// import GameCard from '@/components/GameCard';

const games = [
  { title: 'Win Go', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRVUSogbJ0sNBHrRE9wLsvfN-Ni5qxKBFPw&s', path: '/coming-soon' },
  { title: 'K3', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvq4xPhq25UD9I_nToEzTFqzUx9xpQ45XBDWU3fLD522oOPmdho8sRjpHjzvcGsT2SJFg&usqp=CAU', path: '/coming-soon' },
  { title: '5D', image: 'https://img-c.udemycdn.com/course/750x422/3891594_9190_2.jpg', path: '/coming-soon' },
  { title: 'Trx Win Go', image: 'https://lucknow.games/wp-content/uploads/2024/07/WIN-GO-1-1024x645.webp', path: '/coming-soon' },
  { title: 'MotoRace', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9sBCsp6-e7sl5UUOPoi0tuC6ixGLFoKQBOg&s', path: '/coming-soon' }
];

const GameCard = ({ title, image, path }) => (
  <a
    href={path}
    className="w-[48%] max-w-[180px] mb-4 rounded-xl overflow-hidden shadow-lg bg-white hover:scale-[1.03] transition-transform duration-300"
  >
    <img
      src={image}
      alt={title}
      className="w-full h-[120px] object-cover"
    />
    <div className="p-2 text-center text-sm font-semibold text-gray-800">{title}</div>
  </a>
);

const GameGalleryPage = () => {
  return (
    <div className=" p-4 flex flex-col items-center">
      {/* Two rows of 2, then one center */}
      <div className="w-full  flex flex-wrap justify-between max-w-[400px]">
        {games.slice(0, 2).map((game, index) => (
          <GameCard key={index} {...game} />
        ))}
      </div>
      <div className="w-full flex flex-wrap justify-between max-w-[400px]">
        {games.slice(2, 4).map((game, index) => (
          <GameCard key={index} {...game} />
        ))}
      </div>
      <div className="w-full flex justify-center max-w-[400px]">
        <GameCard {...games[4]} />
      </div>
    </div>
  );
};

export default GameGalleryPage;
