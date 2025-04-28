
import React from 'react';
import { Link } from 'react-router-dom';
import { Languages, Info, User } from 'lucide-react';

const FooterNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="flex justify-around items-center py-2">
        <Link to="/language" className="flex flex-col items-center">
          <Languages className="w-5 h-5 text-game-primary" />
          <span className="text-xs mt-1">Language</span>
        </Link>
        <Link to="/guide" className="flex flex-col items-center">
          <Info className="w-5 h-5 text-game-primary" />
          <span className="text-xs mt-1">Guide</span>
        </Link>
        <Link to="/about" className="flex flex-col items-center">
          <User className="w-5 h-5 text-game-primary" />
          <span className="text-xs mt-1">About Us</span>
        </Link>
      </div>
    </div>
  );
};

export default FooterNavigation;
