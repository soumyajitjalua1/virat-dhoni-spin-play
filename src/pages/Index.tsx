import React from 'react';
import AppHeader from '@/components/AppHeader';
import GameNavigation from '@/components/GameNavigation';
import GameBanner from '@/components/GameBanner';
import FeaturedGames from '@/components/FeaturedGames';
import GameSection from '@/components/GameSection';
import WinnerDisplay from '@/components/WinningInfo';
import FooterNavigation from '@/components/FooterNavigation';
import EarningLeaderboard from '@/components/EarningLeaderboard';
import TirangaInfoSection from '@/components/RichbigInfoSection';
import HelpMenuSection from '@/components/HelpMenuSection';
const bannerImages = [
  "https://www.pocket52.com/_ipx/s_2400x1200/images/landing-pages/poker-rules-resized.webp",
  "/IMG 1.webp",
  "/IMG 2.webp",
  "/IMG 3.webp",
  "/IMG 4.webp",
  "/IMG 5.webp",
  "/IMG 6.webp",
  "/IMG 7.webp",
  "/IMG 8.webp",
  "/IMG 9.webp",
  "/IMG 10.webp",
  "/IMG 11.webp"
];

const popularGames = [
  { title: 'Aviator', image: 'https://i.pinimg.com/736x/5d/eb/10/5deb10028d619a9ea114d959c78a3237.jpg', path: '/coming-soon' },
  { title: 'Plinko', image: 'https://www.gamblingsites.org/app/uploads/2024/03/Plinko-rush-1.jpg', path: '/coming-soon' },
  { title: 'Mines', image: 'https://thumbs.dreamstime.com/b/pile-gold-coins-treasure-mine-cave-modern-cartoon-background-underground-mountain-trove-ruined-place-barrel-315138548.jpg', path: '/coming-soon' },
  { title: 'Fortune Ox', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaUJe04FSdRaVEhVLjp2jpaVChSYgPhZgw&s', path: '/coming-soon' },
  { title: 'Royal Fishing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRixmHMkmQUrvb43BiRtAn3kgFdqm0GVEx2CA&s', path: '/coming-soon' },
  { title: 'Super Rich', image: 'https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/9ccd682c-480e-415e-b945-29df56451fdb/1896681266/super-rich-screenshot.png', path: '/coming-soon' }
];

const casinoGames = [
  { title: 'Crazy Time', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhC6FnIK0quh-1dfb782xnuEH9hz0gCTS6fw&s', path: '/coming-soon' },
  { title: 'Dragon Tiger', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ0JZIon7e6XYH3mVR9ib89w2P0Vgie85loQ&s', path: '/coming-soon' },
  { title: 'Roulette', image: 'https://media.istockphoto.com/id/1212275978/vector/jackpot-casino-vector-illustration-with-roulette-wheel-gambling-chips-and-coins.jpg?s=612x612&w=0&k=20&c=k6AIjyWzWViUudFJttvVqxUpn0nF3p3-Ze-gQN_IWtU=', path: '/coming-soon' },
  { title: 'Baccarat', image: 'https://media.istockphoto.com/id/1212275978/vector/jackpot-casino-vector-illustration-with-roulette-wheel-gambling-chips-and-coins.jpg?s=612x612&w=0&k=20&c=k6AIjyWzWViUudFJttvVqxUpn0nF3p3-Ze-gQN_IWtU=', path: '/coming-soon' },
  { title: 'Blackjack', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfFw5dVkLBP_FvnXmlWTk16lVr-nGbTlsX3w&s', path: '/coming-soon' },
  { title: 'Poker', image: 'https://img.freepik.com/free-vector/realistic-casino-gambling-illustration_52683-99917.jpg?semt=ais_hybrid&w=740', path: '/coming-soon' }
];


const Index = () => {
  return (
    <div className="min-h-screen pb-20">
      <AppHeader />
      <GameBanner images={bannerImages} />
      <GameNavigation />
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">On Going Game</h2>
          <FeaturedGames />
      </div>
      {/* <FeaturedGames /> */}
      <GameSection title="Popular Games" games={popularGames} />
      <GameSection title="Casino Games" games={casinoGames} />
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">Winning information</h2>
        <WinnerDisplay />
      </div>
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">Earning Leaderboard</h2>
        <EarningLeaderboard />
      </div>
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">Rich Big Info</h2>
        <TirangaInfoSection />
      </div>
      <div className="px-2 py-4">
        <h2 className="text-xl font-bold text-game-dark mb-2 ">Help Menu</h2>
        <HelpMenuSection />
      </div>

      <FooterNavigation />
    </div>
  );
};

export default Index;
