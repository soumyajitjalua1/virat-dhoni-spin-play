
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/AppHeader';

const CardGame = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<'virat' | 'dhoni' | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gamePhase, setGamePhase] = useState<'betting' | 'results'>('betting');
  const [viratBets, setViratBets] = useState<number>(0);
  const [dhoniBets, setDhoniBets] = useState<number>(0);
  const [winner, setWinner] = useState<'virat' | 'dhoni' | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(1000);

  useEffect(() => {
    if (gamePhase === 'betting' && timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timerId);
    } else if (gamePhase === 'betting' && timeLeft === 0) {
      determineWinner();
    }
  }, [timeLeft, gamePhase]);

  const placeBet = () => {
    if (!selectedPlayer) {
      toast.error('Please select a player first');
      return;
    }

    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    if (amount > walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    // Update bet totals
    if (selectedPlayer === 'virat') {
      setViratBets(viratBets + amount);
    } else {
      setDhoniBets(dhoniBets + amount);
    }

    // Deduct from wallet
    setWalletBalance(walletBalance - amount);
    
    toast.success(`Bet placed on ${selectedPlayer === 'virat' ? 'Virat' : 'Dhoni'}`);
    setBetAmount('');
  };

  const determineWinner = () => {
    // Determine winner (player with LESS total bets)
    let gameWinner: 'virat' | 'dhoni';
    
    if (viratBets <= dhoniBets) {
      gameWinner = 'virat';
    } else {
      gameWinner = 'dhoni';
    }
    
    setWinner(gameWinner);
    setGamePhase('results');
    
    // Pay winners
    if (selectedPlayer === gameWinner) {
      const winnings = parseFloat(betAmount) * 2;
      setWalletBalance(walletBalance + winnings);
      toast.success(`You won ₹${winnings}!`);
    }
  };

  const startNewGame = () => {
    setSelectedPlayer(null);
    setBetAmount('');
    setTimeLeft(30);
    setViratBets(0);
    setDhoniBets(0);
    setWinner(null);
    setGamePhase('betting');
  };

  return (
    <div className="min-h-screen pb-6 bg-gray-100">
      <AppHeader />
      
      <div className="p-4">
        <Link to="/" className="text-game-primary font-medium flex items-center mb-4">
          ← Back to Home
        </Link>
        
        <h1 className="text-2xl font-bold text-center mb-4">Virat vs Dhoni</h1>
        
        {gamePhase === 'betting' ? (
          <>
            <div className="timer-circle mx-auto border-game-primary text-game-primary mb-4">
              {timeLeft}s
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className={`player-card ${selectedPlayer === 'virat' ? 'ring-2 ring-game-primary' : ''}`}
                onClick={() => setSelectedPlayer('virat')}
              >
                <div className="bg-blue-600 rounded-t-lg p-2 text-center text-white font-bold">
                  Virat Kohli
                </div>
                <div className="bg-white p-3 flex items-center justify-center">
                  <img 
                    src="https://documents.iplt20.com/ipl/IPLHeadshot2025/2.png" 
                    alt="Virat Kohli" 
                    className="h-36" 
                  />
                </div>
                <div className="betting-badge">Total: ₹{viratBets}</div>
              </div>
              
              <div 
                className={`player-card ${selectedPlayer === 'dhoni' ? 'ring-2 ring-game-primary' : ''}`}
                onClick={() => setSelectedPlayer('dhoni')}
              >
                <div className="bg-yellow-500 rounded-t-lg p-2 text-center text-white font-bold">
                  MS Dhoni
                </div>
                <div className="bg-white p-3 flex items-center justify-center">
                  <img 
                    src="https://i.pinimg.com/236x/08/d1/bd/08d1bd467b5e3b22d44b07df0dc173c2.jpg" 
                    alt="MS Dhoni" 
                    className="h-36" 
                  />
                </div>
                <div className="betting-badge">Total: ₹{dhoniBets}</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">Place Your Bet</h2>
              <div className="flex flex-col space-y-3">
                <Input 
                  type="number" 
                  placeholder="Enter bet amount" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-gray-50"
                />
                <Button 
                  onClick={placeBet} 
                  className="bg-game-primary hover:bg-game-primary/80"
                  disabled={!selectedPlayer || !betAmount}
                >
                  Place Bet
                </Button>
              </div>
              
              <div className="mt-3 text-sm text-gray-500">
                <p>Your balance: ₹{walletBalance}</p>
                <p>Selected: {selectedPlayer ? (selectedPlayer === 'virat' ? 'Virat Kohli' : 'MS Dhoni') : 'None'}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Game Results</h2>
            
            <div className="relative h-40 mb-4">
              <img 
                src={winner === 'virat' 
                  ? "https://documents.iplt20.com/ipl/IPLHeadshot2025/2.png"
                  : "https://i.pinimg.com/236x/08/d1/bd/08d1bd467b5e3b22d44b07df0dc173c2.jpg"} 
                alt={winner === 'virat' ? "Virat Kohli" : "MS Dhoni"} 
                className="h-full mx-auto"
              />
              <div className="absolute top-0 left-0 right-0 bg-game-accent text-game-dark py-1 font-bold">
                WINNER!
              </div>
            </div>
            
            <p className="text-lg font-bold mb-4">
              {winner === 'virat' ? 'Virat Kohli' : 'MS Dhoni'} Won!
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-bold">Virat Bets</p>
                <p>₹{viratBets}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-bold">Dhoni Bets</p>
                <p>₹{dhoniBets}</p>
              </div>
            </div>
            
            <Button onClick={startNewGame} className="bg-game-primary hover:bg-game-primary/80 w-full">
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardGame;
