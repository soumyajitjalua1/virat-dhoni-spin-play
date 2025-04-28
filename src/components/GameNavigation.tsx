
import React from 'react';
import { Link } from 'react-router-dom';

type NavItem = {
  name: string;
  path: string;
  icon: string;
};

const navItems: NavItem[] = [
  { name: 'Popular', path: '/', icon: '🔥' },
  { name: 'Lottery', path: '/coming-soon', icon: '🎟️' },
  { name: 'Casino', path: '/coming-soon', icon: '🎰' },
  { name: 'Slots', path: '/coming-soon', icon: '🎮' },
  { name: 'Sport', path: '/coming-soon', icon: '⚽' },
  { name: 'Rummy', path: '/coming-soon', icon: '🃏' },
  { name: 'Fishing', path: '/coming-soon', icon: '🎣' },
  { name: 'Original', path: '/coming-soon', icon: '✨' },
];

const GameNavigation = () => {
  const [activeTab, setActiveTab] = React.useState('Popular');

  return (
    <div className="bg-white shadow-md overflow-x-auto">
      <div className="flex space-x-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-tab ${activeTab === item.name ? 'active' : 'text-gray-600'}`}
            onClick={() => setActiveTab(item.name)}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameNavigation;
