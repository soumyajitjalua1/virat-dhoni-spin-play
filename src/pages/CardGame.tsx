// CardGame.tsx (Enhanced with improved game mechanics and UI)
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/AppHeader';
import { Edit2, Trophy, Clock, Check, X, PartyPopper, Star } from 'lucide-react';

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
  const [winner, setWinner] = useState<'left' | 'right' | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [shuffleTimeLeft, setShuffleTimeLeft] = useState<number>(10);
  const shuffleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  
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
      try {
        setLeftPlayer(JSON.parse(storedLeftPlayer));
      } catch (e) {
        console.error("Failed to parse leftPlayer:", e);
      }
    }
    
    if (storedRightPlayer) {
      try {
        setRightPlayer(JSON.parse(storedRightPlayer));
      } catch (e) {
        console.error("Failed to parse rightPlayer:", e);
      }
    }
    
    // Load wallet balance
    const storedBalance = localStorage.getItem('walletBalance');
    if (storedBalance) {
      const parsedBalance = parseInt(storedBalance);
      if (!isNaN(parsedBalance)) {
        setWalletBalance(parsedBalance);
      } else {
        // Fallback to default balance if parsing fails
        localStorage.setItem('walletBalance', '1000');
        setWalletBalance(1000);
      }
    } else {
      // Set default balance if none exists
      localStorage.setItem('walletBalance', '1000');
      setWalletBalance(1000);
    }
    
    // Load games played count
    const storedGamesPlayed = localStorage.getItem('gamesPlayed');
    if (storedGamesPlayed) {
      const parsedGamesPlayed = parseInt(storedGamesPlayed);
      if (!isNaN(parsedGamesPlayed)) {
        setGamesPlayed(parsedGamesPlayed);
      }
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

    // Store the bet amount for later use (important for determining winnings)
    localStorage.setItem('currentBetAmount', amount.toString());

    // Deduct from wallet
    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    
    // Update localStorage
    localStorage.setItem('walletBalance', newBalance.toString());
    
    // Add transaction record
    addTransaction("Game Bet", amount);
    
    toast.success(`Bet placed on ${selectedPlayer === 'left' ? leftPlayer.name : rightPlayer.name}`);
  };

  const determineWinner = () => {
    // Update games played counter
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    localStorage.setItem('gamesPlayed', newGamesPlayed.toString());
    
    let userWins = false;
    
    // First 3 games: User must win at least one (preferably first or second)
    if (newGamesPlayed <= 3) {
      if (newGamesPlayed === 1) {
        userWins = true; // First game - user wins
      } else if (newGamesPlayed === 2) {
        // 70% chance to win second game
        userWins = Math.random() < 0.7;
      } else {
        // Third game - if user hasn't won previous games, ensure a win
        const hasWonBefore = localStorage.getItem('hasWonFirstThree') === 'true';
        userWins = !hasWonBefore;
        if (userWins) {
          localStorage.setItem('hasWonFirstThree', 'true');
        }
      }
    } else {
      // After 3 games, very low winning chance
      userWins = Math.random() < 0.002; // 0.2% chance to win
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
    
    // Make sure bet amount is valid 
    const betAmountValue = parseFloat(betAmount) || 0;
    
    // Pay winners
    if (selectedPlayer === gameWinner) {
      const winnings = betAmountValue * 2;
      const newBalance = walletBalance + winnings;
      setWalletBalance(newBalance);
      
      // Update localStorage
      localStorage.setItem('walletBalance', newBalance.toString());
      
      // Add transaction record
      addTransaction("Game Win", winnings);
      
      toast.success(`You won ₹${winnings}!`);
    } else {
      toast.error(`You lost your bet!`);
    }
  };

  const startNewGame = () => {
    setSelectedPlayer(null);
    setBetAmount('');
    setTimeLeft(30);
    setShuffleTimeLeft(10);
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
        isSelected ? 'ring-4 ring-game-primary scale-105' : ''
      }`,
      headerClass: `${player.color} `,
      footerClass: `p-3 ${player.color} text-white text-center`
    };
  };

  return (
    <div className={`min-h-screen pb-6 bg-gradient-to-b from-indigo-50 to-blue-100`}>
      <AppHeader />
      
      <div className="p-4 max-w-md mx-auto">
        <Link to="/" className="text-game-primary font-medium flex items-center mb-4 hover:underline">
          ← Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-4 border border-indigo-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between">
            <h1 className="text-2xl font-bold">Card Game</h1>
            <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
              <p className="mr-1">Balance:</p>
              <p className="font-bold">₹{walletBalance}</p>
            </div>
          </div>
          
          {gamePhase === 'betting' && (
            <div className="flex justify-center -mt-5">
              <div className="timer-circle w-16 h-16 rounded-full bg-white border-4 border-game-primary flex items-center justify-center shadow-lg">
                <div className="flex items-center font-bold text-game-primary">
                  <Clock size={16} className="mr-1" /> {timeLeft}s
                </div>
              </div>
            </div>
          )}
          
          {gamePhase === 'shuffling' && (
            <div className="flex justify-center -mt-5">
              <div className="timer-circle w-16 h-16 rounded-full bg-white border-4 border-red-500 flex items-center justify-center shadow-lg">
                <div className="flex items-center font-bold text-red-500">
                  <Clock size={16} className="mr-1" /> {shuffleTimeLeft}s
                </div>
              </div>
            </div>
          )}
          
          {gamePhase === 'betting' && (
            <div className="grid grid-cols-2 gap-4 p-6">
              <div 
                className="h-64 cursor-pointer relative"
                onClick={() => setSelectedPlayer('left')}
              >
                {/* Card Container */}
                <div className={getCardClasses('left').mainClass}>
                  {/* Card Header - Just the color bar */}
                  <div className={getCardClasses('left').headerClass}></div>
                  
                  {/* Card Body - Player Image with team color background */}
                  <div className={`flex items-center justify-center p-3 h-48 ${leftPlayer.color} from-${leftPlayer.color.split('-')[1]}-700 to-${leftPlayer.color.split('-')[1]}-600`}>
                    <img 
                      src={leftPlayer.image} 
                      alt={leftPlayer.name} 
                      className="h-40 object-contain drop-shadow-lg" 
                    />
                  </div>
                  
                  {/* Card Footer - Player Name and Team */}
                  <div className={getCardClasses('left').footerClass}>
                    <p className="font-bold text-sm">{leftPlayer.name}</p>
                    <p className="text-xs opacity-90">{leftPlayer.team}</p>
                  </div>
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
                  <div className={`flex items-center justify-center p-3 h-48 ${rightPlayer.color}  from-${rightPlayer.color.split('-')[1]}-700 to-${rightPlayer.color.split('-')[1]}-600`}>
                    <img 
                      src={rightPlayer.image} 
                      alt={rightPlayer.name} 
                      className="h-40 object-contain drop-shadow-lg" 
                    />
                  </div>
                  
                  {/* Card Footer - Player Name and Team */}
                  <div className={getCardClasses('right').footerClass}>
                    <p className="font-bold text-sm">{rightPlayer.name}</p>
                    <p className="text-xs opacity-90">{rightPlayer.team}</p>
                  </div>
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
            <div className="p-6 text-center">
              {selectedPlayer === winner ? (
                /* User won animation */
                <div className="mb-6 relative celebration-animation">
                  <PartyPopper className="absolute top-0 left-1/4 text-yellow-500 animate-bounce" size={28} />
                  <PartyPopper className="absolute top-0 right-1/4 text-yellow-500 animate-bounce" size={28} />
                  <Star className="absolute top-10 left-1/3 text-yellow-400 animate-pulse" size={24} />
                  <Star className="absolute top-10 right-1/3 text-yellow-400 animate-pulse" size={24} />
                  
                  <img 
                    src={winner === 'left' ? leftPlayer.image : rightPlayer.image} 
                    alt={winner === 'left' ? leftPlayer.name : rightPlayer.name} 
                    className="h-48 mx-auto object-contain winner-animation" 
                  />
                  
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white py-3 font-bold animate-pulse rounded-t-lg">
                    <Trophy size={24} className="inline-block mr-2" /> CONGRATULATIONS!
                  </div>
                </div>
              ) : (
                /* User lost animation */
                <div className="mb-6 relative">
                  <img 
                    src={winner === 'left' ? leftPlayer.image : rightPlayer.image} 
                    alt={winner === 'left' ? leftPlayer.name : rightPlayer.name} 
                    className="h-48 mx-auto object-contain loser-animation" 
                  />
                  
                  <div className="absolute top-0 left-0 right-0 bg-red-500 text-white py-3 font-bold rounded-t-lg">
                    <X size={24} className="inline-block mr-2" /> BETTER LUCK NEXT TIME
                  </div>
                </div>
              )}
              
              <p className="text-xl font-bold mb-6 text-indigo-900">
                {winner === 'left' ? leftPlayer.name : rightPlayer.name} Won!
              </p>
              
              <div className={`p-4 mb-4 rounded-lg ${selectedPlayer === winner ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-100 text-red-800 border-2 border-red-300'}`}>
                {selectedPlayer === winner ? (
                  <div>
                    <p className="font-bold text-lg">Congratulations!</p>
                    <p className="text-2xl font-bold mt-2">You won ₹{(parseFloat(betAmount) || 0) * 2}</p>
                    <p className="mt-2">Your prize has been added to your wallet</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-lg">Better luck next time!</p>
                    <p className="text-lg mt-2">Try again with a different strategy!</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {gamePhase === 'betting' && (
            <div className="p-4 bg-indigo-50 border-t border-indigo-100">
              <h2 className="text-lg font-bold mb-3 flex items-center text-indigo-900">
                <span className="w-2 h-6 bg-game-primary mr-2 rounded"></span>
                Place Your Bet
              </h2>
              <div className="flex flex-col space-y-3">
                <Input 
                  type="number" 
                  placeholder="Enter bet amount" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-white border-2 focus:border-game-primary text-lg p-6 rounded-lg shadow-sm"
                />
                <Button 
                  onClick={placeBet} 
                  className={`bg-game-primary hover:bg-game-primary/80 transition-all text-lg py-6 rounded-lg shadow-md ${
                    !selectedPlayer || !betAmount ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!selectedPlayer || !betAmount}
                >
                  Place Bet
                </Button>
              </div>
              
              <div className="mt-4 flex justify-center items-center text-sm">
                <div>
                  <p className="font-medium text-center text-indigo-900">
                    {selectedPlayer ? (
                      <>Selected: {selectedPlayer === 'left' ? leftPlayer.name : rightPlayer.name}</>
                    ) : (
                      <>Select a player to continue</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {gamePhase === 'results' && (
            <div className="p-4 bg-indigo-50 border-t border-indigo-100">
              <Button 
                onClick={startNewGame} 
                className="bg-game-primary hover:bg-game-primary/80 w-full transition-transform hover:scale-105 py-6 text-lg rounded-lg shadow-lg"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>
        
        {/* Enhanced win chance info card - simplified for users */}
        {gamePhase === 'betting' && (
          <div className="bg-white rounded-lg shadow-lg p-4 border border-indigo-100">
            <div className="flex items-center mb-2">
              <Trophy size={18} className="text-yellow-500 mr-2" />
              <h3 className="font-bold text-indigo-900">Double Your Money!</h3>
            </div>
            <p className="text-gray-700 text-sm">
              Select your favorite player and place your bet. If your player wins, you'll receive double your bet amount instantly!
            </p>
          </div>
        )}
      </div>
      
      {/* CSS for animations */}
      <style >{`
        @keyframes shuffle-left {
          0% { left: -50%; opacity: 0.8; transform: rotate(-5deg); }
          50% { opacity: 1; transform: rotate(5deg); }
          100% { left: 100%; opacity: 0.8; transform: rotate(-5deg); }
        }
        
        @keyframes shuffle-right {
          0% { right: -50%; opacity: 0.8; transform: rotate(5deg); }
          50% { opacity: 1; transform: rotate(-5deg); }
          100% { right: 100%; opacity: 0.8; transform: rotate(5deg); }
        }
        
        .card-shuffle-left {
          animation: shuffle-left 1.5s linear infinite;
        }
        
        .card-shuffle-right {
          animation: shuffle-right 1.5s linear infinite;
        }
        
        @keyframes winner-animation {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .winner-animation {
          animation: winner-animation 1s ease-out;
        }
        
        @keyframes loser-animation {
          0% { transform: scale(1); filter: grayscale(0); }
          100% { transform: scale(0.95); filter: grayscale(40%); }
        }
        
        .loser-animation {
          animation: loser-animation 1s ease-out forwards;
        }
        
        @keyframes celebration {
          0% { transform: rotate(-5deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
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