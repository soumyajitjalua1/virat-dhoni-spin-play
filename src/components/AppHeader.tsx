import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';

const AppHeader = () => {
  const [walletBalance, setWalletBalance] = useState(0);

  // Load wallet balance from localStorage when component mounts and when it updates
  useEffect(() => {
    // Function to get wallet balance
    const getWalletBalance = () => {
      const storedBalance = localStorage.getItem('walletBalance');
      return storedBalance ? parseInt(storedBalance) : 0;
    };

    // Set the initial wallet balance
    setWalletBalance(getWalletBalance());
    
    // Set up an event listener to update the balance when localStorage changes
    const handleStorageChange = () => {
      setWalletBalance(getWalletBalance());
    };
    
    // Add event listener for storage changes from other components
    window.addEventListener('storage', handleStorageChange);
    
    // Create a custom event listener for local updates
    document.addEventListener('walletBalanceUpdated', handleStorageChange);
    
    // Check for balance updates every 2 seconds (as a backup for when events don't trigger)
    const intervalId = setInterval(() => {
      const currentBalance = getWalletBalance();
      if (currentBalance !== walletBalance) {
        setWalletBalance(currentBalance);
      }
    }, 2000);
    
    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('walletBalanceUpdated', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [walletBalance]);

  return (
    <header className="bg-game-primary text-white py-3 px-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="p-1 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 shadow-md">
            <img
              src="/RichBig.png"
              alt="Logo"
              className="h-16 w-auto" // bigger logo
            />
          </div>
        </Link>
        <div className="flex items-center space-x-3">
          <Link to="/wallet" className="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            <span>₹{walletBalance}</span>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="bg-game-accent text-game-dark border-none hover:bg-game-accent/80">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="sm" className="bg-white text-game-primary border-none hover:bg-white/90">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;