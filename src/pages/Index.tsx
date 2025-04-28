import React from 'react';
import AppHeader from '@/components/AppHeader';
import GameNavigation from '@/components/GameNavigation';
import GameBanner from '@/components/GameBanner';
import FeaturedGames from '@/components/FeaturedGames';
import GameSection from '@/components/GameSection';
import WinnerDisplay from '@/components/WinnerDisplay';
import FooterNavigation from '@/components/FooterNavigation';

const bannerImages = [
  "https://www.pocket52.com/_ipx/s_2400x1200/images/landing-pages/poker-rules-resized.webp",
  "https://i0.wp.com/bonaccordaberdeen.com/wp-content/uploads/2023/01/Game-ready-to-play-504x336-1.webp?fit=504%2C336&ssl=1",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5LTKfLoNZbT5--GKSG341Dnby18x9cKMtTA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScQEw1oPUaV3Mg5NsIOFYp9yozz1WNjJ2xUw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzDZdEA7Rox4Rc2Uf9-kcTWusbBFhylc0uDg&s",
  "https://ossimg.tirangaagent.com/Tiranga/banner/Banner_20240413184815hgcm.png",
  "https://ossimg.tirangaagent.com/Tiranga/banner/Banner_20240412140444pw4u.jpg"
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
      <GameNavigation />
      <GameBanner images={bannerImages} />
      <FeaturedGames />
      <GameSection title="Popular Games" games={popularGames} />
      <GameSection title="Casino Games" games={casinoGames} />
      <div className="px-2 py-4">
        <WinnerDisplay />
      </div>
      <FooterNavigation />
    </div>
  );
};

export default Index;
