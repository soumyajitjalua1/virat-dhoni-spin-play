
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const AppHeader = () => {
  const [walletBalance, setWalletBalance] = React.useState(1000);
  
  return (
    <header className="bg-game-primary text-white py-3 px-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Game Portal
        </Link>
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
            <span>₹{walletBalance}</span>
          </div>
          <Button variant="outline" size="sm" className="bg-game-accent text-game-dark border-none hover:bg-game-accent/80">
            Deposit
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
