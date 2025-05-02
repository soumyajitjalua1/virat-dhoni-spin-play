// CardGame.tsx (Updated with player customization)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/AppHeader';
import { Edit2 } from 'lucide-react';

// Define player interface
interface Player {
  id: number;
  name: string;
  image: string;
  team: string;
  color: string;
}

const CardGame = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [selectedPlayer, setSelectedPlayer] = useState<'left' | 'right' | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gamePhase, setGamePhase] = useState<'betting' | 'results'>('betting');
  const [leftBets, setLeftBets] = useState<number>(0);
  const [rightBets, setRightBets] = useState<number>(0);
  const [winner, setWinner] = useState<'left' | 'right' | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  // Default players
  const defaultLeftPlayer: Player = {
    id: 1,
    name: 'Virat Kohli', 
    image: '/Virat_Kohli%20.png',
    team: 'RCB',
    color: 'bg-blue-600'
  };
  
  const defaultRightPlayer: Player = {
    id: 2,
    name: 'MS Dhoni',
    image: 'https://i.pinimg.com/236x/08/d1/bd/08d1bd467b5e3b22d44b07df0dc173c2.jpg',
    team: 'CSK',
    color: 'bg-yellow-500'
  };

  // State for the players
  const [leftPlayer, setLeftPlayer] = useState<Player>(defaultLeftPlayer);
  const [rightPlayer, setRightPlayer] = useState<Player>(defaultRightPlayer);

  // Load custom players and wallet balance from localStorage if available
  useEffect(() => {
    // Load players
    const storedLeftPlayer = localStorage.getItem('leftPlayer');
    const storedRightPlayer = localStorage.getItem('rightPlayer');
    
    if (storedLeftPlayer) {
      setLeftPlayer(JSON.parse(storedLeftPlayer));
    }
    
    if (storedRightPlayer) {
      setRightPlayer(JSON.parse(storedRightPlayer));
    }
    
    // Load wallet balance
    const storedBalance = localStorage.getItem('walletBalance');
    if (storedBalance) {
      setWalletBalance(parseInt(storedBalance));
    } else {
      // Set default balance if none exists
      localStorage.setItem('walletBalance', '1000');
      setWalletBalance(1000);
    }
  }, []);

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
    if (selectedPlayer === 'left') {
      setLeftBets(leftBets + amount);
    } else {
      setRightBets(rightBets + amount);
    }

    // Deduct from wallet
    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    
    // Update localStorage
    localStorage.setItem('walletBalance', newBalance.toString());
    
    // Add transaction record
    addTransaction("Game Bet", amount);
    
    toast.success(`Bet placed on ${selectedPlayer === 'left' ? leftPlayer.name : rightPlayer.name}`);
    setBetAmount('');
  };

  const determineWinner = () => {
    // Determine winner (player with LESS total bets)
    let gameWinner: 'left' | 'right';
    
    if (leftBets <= rightBets) {
      gameWinner = 'left';
    } else {
      gameWinner = 'right';
    }
    
    setWinner(gameWinner);
    setGamePhase('results');
    
    // Pay winners
    if (selectedPlayer === gameWinner) {
      const winnings = parseFloat(betAmount) * 2;
      const newBalance = walletBalance + winnings;
      setWalletBalance(newBalance);
      
      // Update localStorage
      localStorage.setItem('walletBalance', newBalance.toString());
      
      // Add transaction record
      addTransaction("Game Win", winnings);
      
      toast.success(`You won ₹${winnings}!`);
    }
  };

  const startNewGame = () => {
    setSelectedPlayer(null);
    setBetAmount('');
    setTimeLeft(30);
    setLeftBets(0);
    setRightBets(0);
    setWinner(null);
    setGamePhase('betting');
  };

  const goToPlayerSelection = () => {
    navigate('/player-selection');
  };
  
  // Function to add transaction to history
  const addTransaction = (type: string, amount: number) => {
    // Get existing transactions
    const storedTransactions = localStorage.getItem('transactions');
    let transactions = [];
    
    if (storedTransactions) {
      transactions = JSON.parse(storedTransactions);
    }
    
    // Create new transaction
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10) + ' ' + 
                      now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
                      
    const newTransaction = {
      id: Date.now(),
      type,
      amount,
      date: dateString,
      status: 'Success'
    };
    
    // Add to transactions and save
    const updatedTransactions = [newTransaction, ...transactions];
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  return (
    <div className="min-h-screen pb-6 bg-gray-100">
      <AppHeader />
      
      <div className="p-4">
        <Link to="/" className="text-game-primary font-medium flex items-center mb-4">
          ← Back to Home
        </Link>
        
        <h1 className="text-2xl font-bold text-center mb-4">{leftPlayer.name} vs {rightPlayer.name}</h1>
        
        {gamePhase === 'betting' ? (
          <>
            <div className="timer-circle mx-auto border-game-primary text-game-primary mb-4">
              {timeLeft}s
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className={`player-card relative ${selectedPlayer === 'left' ? 'ring-2 ring-game-primary' : ''}`}
                onClick={() => setSelectedPlayer('left')}
              >
                <div className={`${leftPlayer.color} rounded-t-lg p-2 text-center text-white font-bold`}>
                  {leftPlayer.name}
                </div>
                <div className="bg-white p-3 flex items-center justify-center">
                  <img 
                    src={leftPlayer.image} 
                    alt={leftPlayer.name} 
                    className="h-36 object-contain" 
                  />
                </div>
                <div className="betting-badge">Total: ₹{leftBets}</div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPlayerSelection();
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
              
              <div 
                className={`player-card relative ${selectedPlayer === 'right' ? 'ring-2 ring-game-primary' : ''}`}
                onClick={() => setSelectedPlayer('right')}
              >
                <div className={`${rightPlayer.color} rounded-t-lg p-2 text-center text-white font-bold`}>
                  {rightPlayer.name}
                </div>
                <div className="bg-white p-3 flex items-center justify-center">
                  <img 
                    src={rightPlayer.image} 
                    alt={rightPlayer.name} 
                    className="h-36 object-contain" 
                  />
                </div>
                <div className="betting-badge">Total: ₹{rightBets}</div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPlayerSelection();
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
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
                <p>Selected: {selectedPlayer ? (selectedPlayer === 'left' ? leftPlayer.name : rightPlayer.name) : 'None'}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Game Results</h2>
            
            <div className="relative h-40 mb-4">
              <img 
                src={winner === 'left' ? leftPlayer.image : rightPlayer.image} 
                alt={winner === 'left' ? leftPlayer.name : rightPlayer.name} 
                className="h-full mx-auto object-contain"
              />
              <div className="absolute top-0 left-0 right-0 bg-game-accent text-game-dark py-1 font-bold">
                WINNER!
              </div>
            </div>
            
            <p className="text-lg font-bold mb-4">
              {winner === 'left' ? leftPlayer.name : rightPlayer.name} Won!
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-bold">{leftPlayer.name} Bets</p>
                <p>₹{leftBets}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-bold">{rightPlayer.name} Bets</p>
                <p>₹{rightBets}</p>
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