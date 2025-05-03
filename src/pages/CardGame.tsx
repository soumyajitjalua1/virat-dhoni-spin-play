// CardGame.tsx (Updated with improved shuffling and design)
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/AppHeader';
import { Edit2, Trophy, Clock, Check, X, PartyPopper } from 'lucide-react';

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
  const [gamePhase, setGamePhase] = useState<'betting' | 'shuffling' | 'results'>('betting');
  const [leftBets, setLeftBets] = useState<number>(0);
  const [rightBets, setRightBets] = useState<number>(0);
  const [winner, setWinner] = useState<'left' | 'right' | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [shuffleTimeLeft, setShuffleTimeLeft] = useState<number>(10);
  const shuffleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Card backside image
  const cardBackside = "https://i.pinimg.com/474x/d6/6f/fd/d66ffd7836903e90c99f04c2ce0e3888.jpg";

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

  // Timer for betting phase
  useEffect(() => {
    if (gamePhase === 'betting' && timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timerId);
    } else if (gamePhase === 'betting' && timeLeft === 0) {
      startShuffling();
    }
  }, [timeLeft, gamePhase]);

  // Timer for shuffling phase
  useEffect(() => {
    if (gamePhase === 'shuffling' && shuffleTimeLeft > 0) {
      const timerId = setTimeout(() => {
        setShuffleTimeLeft(shuffleTimeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timerId);
    } else if (gamePhase === 'shuffling' && shuffleTimeLeft === 0) {
      determineWinner();
    }
  }, [shuffleTimeLeft, gamePhase]);

  // Clean up shuffle timer when component unmounts
  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current) {
        clearTimeout(shuffleTimerRef.current);
      }
    };
  }, []);

  // Function to handle shuffling animation
  const startShuffling = () => {
    setGamePhase('shuffling');
    setShuffleTimeLeft(10);
  };

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
      
      // Bot places bet on the right player (opposite of user)
      const botBetAmount = calculateBotBetAmount(amount);
      setRightBets(rightBets + botBetAmount);
    } else {
      setRightBets(rightBets + amount);
      
      // Bot places bet on the left player (opposite of user)
      const botBetAmount = calculateBotBetAmount(amount);
      setLeftBets(leftBets + botBetAmount);
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

  // Calculate bot bet amount (always less than user bet)
  const calculateBotBetAmount = (userBet: number): number => {
    return Math.max(1, Math.floor(userBet * 0.8));
  };

  const determineWinner = () => {
    // Determine winner based on the specified win chances
    let userWins = false;
    const userBetAmount = parseFloat(betAmount);
    const randomChance = Math.random();
    
    if (userBetAmount < 10) {
      userWins = randomChance < 0.6; // 60% chance
    } else if (userBetAmount >= 10 && userBetAmount < 50) {
      userWins = randomChance < 0.4; // 40% chance
    } else if (userBetAmount >= 50 && userBetAmount < 100) {
      userWins = randomChance < 0.1; // 10% chance
    } else {
      userWins = randomChance < 0.001; // 0.1% chance
    }
    
    // Set winner based on calculation
    let gameWinner: 'left' | 'right';
    
    if ((selectedPlayer === 'left' && userWins) || (selectedPlayer === 'right' && !userWins)) {
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
    } else {
      toast.error(`You lost ₹${betAmount}!`);
    }
  };

  const startNewGame = () => {
    setSelectedPlayer(null);
    setBetAmount('');
    setTimeLeft(30);
    setShuffleTimeLeft(10);
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

  // Helper to determine card classes
  const getCardClasses = (side: 'left' | 'right') => {
    const player = side === 'left' ? leftPlayer : rightPlayer;
    const isSelected = selectedPlayer === side;
    
    return {
      mainClass: `h-full w-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform ${
        isSelected ? 'ring-2 ring-game-primary scale-105' : ''
      }`,
      headerClass: `${player.color} h-4`,
      footerClass: `p-2 ${player.color} text-white text-center`
    };
  };

  return (
    <div className={`min-h-screen pb-6 bg-gradient-to-b from-gray-100 to-gray-200`}>
      <AppHeader />
      
      <div className="p-4 max-w-md mx-auto">
        <Link to="/" className="text-game-primary font-medium flex items-center mb-4 hover:underline">
          ← Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 text-white">
            <h1 className="text-2xl font-bold text-center">Card Game</h1>
          </div>
          
          {gamePhase === 'betting' && (
            <div className="flex justify-center ">
              <div className="timer-circle w-16 h-16 rounded-full bg-white border-4 border-game-primary flex items-center justify-center shadow-md">
                <div className="flex items-center font-bold text-game-primary">
                  <Clock size={16} className="mr-1" /> {timeLeft}s
                </div>
              </div>
            </div>
          )}
          
          {gamePhase === 'shuffling' && (
            <div className="flex justify-center -mt-5">
              <div className="timer-circle w-16 h-16 rounded-full bg-white border-4 border-red-500 flex items-center justify-center shadow-md">
                <div className="flex items-center font-bold text-red-500">
                  <Clock size={16} className="mr-1" /> {shuffleTimeLeft}s
                </div>
              </div>
            </div>
          )}
          
          {gamePhase === 'betting' && (
            <div className="grid grid-cols-2 gap-4 p-4">
              <div 
                className="h-64 cursor-pointer relative"
                onClick={() => setSelectedPlayer('left')}
              >
                {/* Card Container */}
                <div className={getCardClasses('left').mainClass}>
                  {/* Card Header - Just the color bar */}
                  <div className={getCardClasses('left').headerClass}></div>
                  
                  {/* Card Body - Player Image with team color background */}
                  <div className={`flex items-center justify-center p-3 h-48 ${leftPlayer.color}`}>
                    <img 
                      src={leftPlayer.image} 
                      alt={leftPlayer.name} 
                      className="h-40 object-contain" 
                    />
                  </div>
                  
                  {/* Card Footer - Player Name and Team */}
                  <div className={getCardClasses('left').footerClass}>
                    <p className="font-bold text-sm">{leftPlayer.name}</p>
                    <p className="text-xs opacity-90">{leftPlayer.team}</p>
                  </div>
                </div>
                
                {/* Bet Badge */}
                <div className="absolute top-2 right-2 bg-game-primary text-white text-xs px-2 py-1 rounded-full">
                  ₹{leftBets}
                </div>
                
                {/* Edit Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPlayerSelection();
                  }}
                  className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
                
                {/* Selection Indicator */}
                {selectedPlayer === 'left' && (
                  <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md">
                    <Check size={16} className="text-green-500" />
                  </div>
                )}
              </div>
              
              <div 
                className="h-64 cursor-pointer relative"
                onClick={() => setSelectedPlayer('right')}
              >
                {/* Card Container */}
                <div className={getCardClasses('right').mainClass}>
                  {/* Card Header - Just the color bar */}
                  <div className={getCardClasses('right').headerClass}></div>
                  
                  {/* Card Body - Player Image with team color background */}
                  <div className={`flex items-center justify-center p-3 h-48 ${rightPlayer.color} `}>
                    <img 
                      src={rightPlayer.image} 
                      alt={rightPlayer.name} 
                      className="h-40 object-contain" 
                    />
                  </div>
                  
                  {/* Card Footer - Player Name and Team */}
                  <div className={getCardClasses('right').footerClass}>
                    <p className="font-bold text-sm">{rightPlayer.name}</p>
                    <p className="text-xs opacity-90">{rightPlayer.team}</p>
                  </div>
                </div>
                
                {/* Bet Badge */}
                <div className="absolute top-2 right-2 bg-game-primary text-white text-xs px-2 py-1 rounded-full">
                  ₹{rightBets}
                </div>
                
                {/* Edit Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPlayerSelection();
                  }}
                  className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
                
                {/* Selection Indicator */}
                {selectedPlayer === 'right' && (
                  <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md">
                    <Check size={16} className="text-green-500" />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {gamePhase === 'shuffling' && (
            <div className="p-6 flex justify-center items-center min-h-[250px] relative overflow-hidden">
              {/* Left card moving right */}
              <div className="card-shuffle-left absolute w-40 h-56 rounded-lg shadow-lg">
                <img 
                  src={cardBackside} 
                  alt="Card back" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
              
              {/* Right card moving left */}
              <div className="card-shuffle-right absolute w-40 h-56 rounded-lg shadow-lg">
                <img 
                  src={cardBackside} 
                  alt="Card back" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
              
              <p className="absolute bottom-2 text-center text-gray-500 font-medium">
                Shuffling cards...
              </p>
            </div>
          )}
          
          {gamePhase === 'results' && (
            <div className="p-4 text-center">
              {selectedPlayer === winner ? (
                /* User won animation */
                <div className="mb-4 relative celebration-animation">
                  <PartyPopper className="absolute top-0 left-1/4 text-yellow-500 animate-bounce" size={24} />
                  <PartyPopper className="absolute top-0 right-1/4 text-yellow-500 animate-bounce" size={24} />
                  
                  <img 
                    src={winner === 'left' ? leftPlayer.image : rightPlayer.image} 
                    alt={winner === 'left' ? leftPlayer.name : rightPlayer.name} 
                    className="h-40 mx-auto object-contain winner-animation" 
                  />
                  
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white py-2 font-bold animate-pulse">
                    <Trophy size={20} className="inline-block mr-1" /> CONGRATULATIONS!
                  </div>
                </div>
              ) : (
                /* User lost animation */
                <div className="mb-4 relative">
                  <img 
                    src={winner === 'left' ? leftPlayer.image : rightPlayer.image} 
                    alt={winner === 'left' ? leftPlayer.name : rightPlayer.name} 
                    className="h-40 mx-auto object-contain" 
                  />
                  
                  <div className="absolute top-0 left-0 right-0 bg-red-500 text-white py-2 font-bold">
                    <X size={20} className="inline-block mr-1" /> BETTER LUCK NEXT TIME
                  </div>
                </div>
              )}
              
              <p className="text-lg font-bold mb-4">
                {winner === 'left' ? leftPlayer.name : rightPlayer.name} Won!
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className={`${leftPlayer.color} text-white p-3 rounded-lg`}>
                  <p className="font-bold">{leftPlayer.name}</p>
                  <p>₹{leftBets}</p>
                </div>
                <div className={`${rightPlayer.color} text-white p-3 rounded-lg`}>
                  <p className="font-bold">{rightPlayer.name}</p>
                  <p>₹{rightBets}</p>
                </div>
              </div>
              
              <div className={`p-3 mb-4 rounded-lg ${selectedPlayer === winner ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {selectedPlayer === winner ? (
                  <div>
                    <p className="font-bold">Congratulations!</p>
                    <p>You won ₹{parseFloat(betAmount) * 2}</p>
                    <p className="text-xs mt-1">+₹{parseFloat(betAmount) * 2} added to your wallet</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold">Better luck next time!</p>
                    <p>You lost ₹{betAmount}</p>
                    <p className="text-xs mt-1">Don't worry, try again with a different strategy!</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {gamePhase === 'betting' && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <span className="w-2 h-6 bg-game-primary mr-2 rounded"></span>
                Place Your Bet
              </h2>
              <div className="flex flex-col space-y-3">
                <Input 
                  type="number" 
                  placeholder="Enter bet amount" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-white border-2 focus:border-game-primary"
                />
                <Button 
                  onClick={placeBet} 
                  className={`bg-game-primary hover:bg-game-primary/80 transition-all ${
                    !selectedPlayer || !betAmount ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!selectedPlayer || !betAmount}
                >
                  Place Bet
                </Button>
              </div>
              
              <div className="mt-4 flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <p>Balance: ₹{walletBalance}</p>
                </div>
                <div>
                  <p className="font-medium">
                    {selectedPlayer ? (
                      <>Selected: {selectedPlayer === 'left' ? leftPlayer.name : rightPlayer.name}</>
                    ) : (
                      <>Select a player</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {gamePhase === 'results' && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Button 
                onClick={startNewGame} 
                className="bg-game-primary hover:bg-game-primary/80 w-full transition-transform hover:scale-105"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>
        
        {/* Win chance info card */}
        {gamePhase === 'betting' && (
          <div className="bg-white rounded-lg shadow-md p-4 text-sm">
            <h3 className="font-bold mb-2 text-game-primary">Win Chances</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Bet &lt;₹10: Higher chance to win! (60%)</li>
              <li>• Bet ₹10-₹50: Good chance to win (40%)</li>
              <li>• Bet ₹50-₹100: Lower chance to win (10%)</li>
              <li>• Bet &gt;₹100: Very low chance to win (0.1%)</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* CSS for animations */}
      <style >{`
        @keyframes shuffle-left {
          0% { left: -50%; }
          100% { left: 100%; }
        }
        
        @keyframes shuffle-right {
          0% { right: -50%; }
          100% { right: 100%; }
        }
        
        .card-shuffle-left {
          animation: shuffle-left 2s linear infinite;
        }
        
        .card-shuffle-right {
          animation: shuffle-right 2s linear infinite;
        }
        
        @keyframes winner-animation {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .winner-animation {
          animation: winner-animation 1s ease-out;
        }
        
        @keyframes celebration {
          0% { transform: rotate(-10deg); }
          25% { transform: rotate(10deg); }
          50% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0); }
        }
        
        .celebration-animation {
          animation: celebration 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CardGame;