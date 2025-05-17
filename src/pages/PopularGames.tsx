import React from 'react';
import AppHeader from '@/components/AppHeader';
import FeaturedGames from '@/components/FeaturedGames';
import GameSection from '@/components/GameSection';
import WinnerDisplay from '@/components/WinningInfo';
import FooterNavigation from '@/components/FooterNavigation';
import EarningLeaderboard from '@/components/EarningLeaderboard';
import GameList from '@/components/GameList';

const popularGames = [
  { title: 'Aviator', image: 'https://i.pinimg.com/736x/5d/eb/10/5deb10028d619a9ea114d959c78a3237.jpg', path: '/coming-soon' },
  { title: 'Plinko', image: 'https://www.gamblingsites.org/app/uploads/2024/03/Plinko-rush-1.jpg', path: '/coming-soon' },
  { title: 'Mines', image: 'https://thumbs.dreamstime.com/b/pile-gold-coins-treasure-mine-cave-modern-cartoon-background-underground-mountain-trove-ruined-place-barrel-315138548.jpg', path: '/coming-soon' },
  { title: 'Fortune Ox', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaUJe04FSdRaVEhVLjp2jpaVChSYgPhZgw&s', path: '/coming-soon' },
  { title: 'Royal Fishing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRixmHMkmQUrvb43BiRtAn3kgFdqm0GVEx2CA&s', path: '/coming-soon' },
  { title: 'Super Rich', image: 'https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/9ccd682c-480e-415e-b945-29df56451fdb/1896681266/super-rich-screenshot.png', path: '/coming-soon' }
];


const PopularGame = () => {
  return (
    <div className="min-h-screen pb-20">
      <AppHeader />
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">On Going Game</h2>
          <FeaturedGames />
      </div>
      {/* gamelist */}
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">Game List</h2>
        <GameList />
      </div>
      {/* <FeaturedGames /> */}
      <GameSection title="Popular Games" games={popularGames} />
      {/* <GameSection title="Casino Games" games={casinoGames} /> */}
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">Winning information</h2>
        <WinnerDisplay />
      </div>
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">Earning Leaderboard</h2>
        <EarningLeaderboard />
      </div>
      

      <FooterNavigation />
    </div>
  );
};

export default PopularGame;