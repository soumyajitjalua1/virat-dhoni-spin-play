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
  const [playerSelection, setPlayerSelection] = useState<'left' | 'right' | null>(null); // For final player choice
  const [betAmount, setBetAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(45); // Updated to 45 seconds
  const [cardRotationPhase, setCardRotationPhase] = useState<boolean>(false);
  const [showBackside, setShowBackside] = useState<boolean>(false);
  const [gamePhase, setGamePhase] = useState<'initial' | 'cardRotation' | 'shuffling' | 'selection' | 'results'>('initial');
  const [winner, setWinner] = useState<'left' | 'right' | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [shuffleTimeLeft, setShuffleTimeLeft] = useState<number>(10);
  const [selectionTimeLeft, setSelectionTimeLeft] = useState<number>(10);
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
  const [finalCard, setFinalCard] = useState<'left' | 'right' | null>(null);

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

  // Main game timer (45 seconds)
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // After 7 seconds, start card rotation
        if (timeLeft === 38 && gamePhase === 'initial') {
          setGamePhase('cardRotation');
          setCardRotationPhase(true);
          
          // Show backside after slight delay for animation
          setTimeout(() => {
            setShowBackside(true);
          }, 500);
          
          // Start shuffling after 2 seconds
          setTimeout(() => {
            setGamePhase('shuffling');
            setShuffleTimeLeft(10);
          }, 2000);
        }
      }, 1000);
      
      return () => clearTimeout(timerId);
    } else {
      // When timer reaches 0, automatically start new game
      startNewGame();
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
      // After shuffling, show selection phase
      setGamePhase('selection');
      setSelectionTimeLeft(10);
      
      // Determine final card randomly but influenced by win chances
      determineWinningCard();
    }
  }, [shuffleTimeLeft, gamePhase]);
  
  // Timer for selection phase
  useEffect(() => {
    if (gamePhase === 'selection' && selectionTimeLeft > 0) {
      const timerId = setTimeout(() => {
        setSelectionTimeLeft(selectionTimeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timerId);
    } else if (gamePhase === 'selection' && selectionTimeLeft === 0) {
      // Time's up for selection, show results
      finalizeGame();
    }
  }, [selectionTimeLeft, gamePhase]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current) {
        clearTimeout(shuffleTimerRef.current);
      }
    };
  }, []);

  // Determine which card will win
  const determineWinningCard = () => {
    // Determine the final card that will be shown
    setFinalCard(Math.random() < 0.5 ? 'left' : 'right');
  };
  
  // Select player and place bet during selection phase
  const selectPlayer = (player: 'left' | 'right') => {
    if (gamePhase !== 'selection') return;
    
    setPlayerSelection(player);
    if (betAmount) {
      placeBet(player);
    } else {
      toast.error('Please enter a bet amount first');
    }
  };

  const placeBet = (selectedPlayerChoice: 'left' | 'right') => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    if (amount > walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    // Store the bet amount for later use
    localStorage.setItem('currentBetAmount', amount.toString());

    // Deduct from wallet
    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    
    // Update localStorage
    localStorage.setItem('walletBalance', newBalance.toString());
    
    // Add transaction record
    addTransaction("Game Bet", amount);
    
    toast.success(`Bet placed on ${selectedPlayerChoice === 'left' ? leftPlayer.name : rightPlayer.name}`);
    
    // If selection timer is very low, finalize game immediately
    if (selectionTimeLeft <= 2) {
      finalizeGame();
    }
  };

  const finalizeGame = () => {
    setGamePhase('results');
    
    // Update games played counter
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    localStorage.setItem('gamesPlayed', newGamesPlayed.toString());
    
    let userWins = false;
    
    // First 3 games: User must win at least one
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
      // After 3 games, 20% winning chance
      userWins = Math.random() < 0.2; // 20% chance to win
    }
    
    // Determine winner based on user selection and win chance
    if ((playerSelection === finalCard) === userWins) {
      setWinner(finalCard);
    } else {
      setWinner(finalCard === 'left' ? 'right' : 'left');
    }
    
    // Process bet results
    const betAmountValue = parseFloat(betAmount) || 0;
    
    if (playerSelection === winner) {
      const winnings = betAmountValue * 2;
      const newBalance = walletBalance + winnings;
      setWalletBalance(newBalance);
      
      // Update localStorage
      localStorage.setItem('walletBalance', newBalance.toString());
      
      // Add transaction record
      addTransaction("Game Win", winnings);
      
      toast.success(`You won ₹${winnings}!`);
    } else if (playerSelection !== null) {
      toast.error(`You lost your bet!`);
    }
  };

  const startNewGame = () => {
    setSelectedPlayer(null);
    setPlayerSelection(null);
    setBetAmount('');
    setTimeLeft(45);
    setShuffleTimeLeft(10);
    setSelectionTimeLeft(10);
    setWinner(null);
    setFinalCard(null);
    setCardRotationPhase(false);
    setShowBackside(false);
    setGamePhase('initial');
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
      headerClass: `${player.color}`,
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
          
          {/* Main game timer - always visible and more prominent */}
          <div className="flex justify-center -mt-5">
            <div className={`timer-circle w-20 h-20 rounded-full bg-white border-4 ${
              timeLeft <= 10 ? 'border-red-500 animate-pulse' : 'border-game-primary'
            } flex items-center justify-center shadow-lg`}>
              <div className={`flex flex-col items-center font-bold ${
                timeLeft <= 10 ? 'text-red-500' : 'text-game-primary'
              }`}>
                <Clock size={timeLeft <= 10 ? 20 : 16} className="mb-1" /> 
                <span className={`${timeLeft <= 10 ? 'text-xl' : 'text-lg'}`}>{timeLeft}s</span>
              </div>
            </div>
          </div>
          
          {/* Initial Phase - Show both player cards */}
          {(gamePhase === 'initial' || gamePhase === 'cardRotation') && (
            <div className="grid grid-cols-2 gap-4 p-6">
              {/* Left Card */}
              <div className="h-64 relative perspective-1000">
                <div className={`card-container w-full h-full transition-transform duration-1000 ${cardRotationPhase ? 'rotate-y-180' : ''}`}>
                  {/* Front Side */}
                  <div className={`card-front absolute w-full h-full backface-hidden ${getCardClasses('left').mainClass}`}>
                    {/* Card Header */}
                    <div className={getCardClasses('left').headerClass}></div>
                    
                    {/* Card Body - Player Image */}
                    <div className={`flex items-center justify-center p-3 h-48 ${leftPlayer.color} from-${leftPlayer.color.split('-')[1]}-700 to-${leftPlayer.color.split('-')[1]}-600`}>
                      <img 
                        src={leftPlayer.image} 
                        alt={leftPlayer.name} 
                        className="h-40 object-contain drop-shadow-lg" 
                      />
                    </div>
                    
                    {/* Card Footer */}
                    <div className={getCardClasses('left').footerClass}>
                      <p className="font-bold text-sm">{leftPlayer.name}</p>
                      <p className="text-xs opacity-90">{leftPlayer.team}</p>
                    </div>
                  </div>
                  
                  {/* Back Side */}
                  <div className="card-back absolute w-full h-full backface-hidden rotate-y-180">
                    <img 
                      src={cardBackside}
                      alt="Card back" 
                      className="w-full h-full object-cover rounded-lg shadow-lg" 
                    />
                  </div>
                </div>
                
                {/* Edit Button - visible only in initial phase */}
                {gamePhase === 'initial' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPlayerSelection();
                    }}
                    className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                )}
              </div>
              
              {/* Right Card */}
              <div className="h-64 relative perspective-1000">
                <div className={`card-container w-full h-full transition-transform duration-1000 ${cardRotationPhase ? 'rotate-y-180' : ''}`}>
                  {/* Front Side */}
                  <div className={`card-front absolute w-full h-full backface-hidden ${getCardClasses('right').mainClass}`}>
                    {/* Card Header */}
                    <div className={getCardClasses('right').headerClass}></div>
                    
                    {/* Card Body - Player Image */}
                    <div className={`flex items-center justify-center p-3 h-48 ${rightPlayer.color} from-${rightPlayer.color.split('-')[1]}-700 to-${rightPlayer.color.split('-')[1]}-600`}>
                      <img 
                        src={rightPlayer.image} 
                        alt={rightPlayer.name} 
                        className="h-40 object-contain drop-shadow-lg" 
                      />
                    </div>
                    
                    {/* Card Footer */}
                    <div className={getCardClasses('right').footerClass}>
                      <p className="font-bold text-sm">{rightPlayer.name}</p>
                      <p className="text-xs opacity-90">{rightPlayer.team}</p>
                    </div>
                  </div>
                  
                  {/* Back Side */}
                  <div className="card-back absolute w-full h-full backface-hidden rotate-y-180">
                    <img 
                      src={cardBackside}
                      alt="Card back" 
                      className="w-full h-full object-cover rounded-lg shadow-lg" 
                    />
                  </div>
                </div>
                
                {/* Edit Button - visible only in initial phase */}
                {gamePhase === 'initial' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPlayerSelection();
                    }}
                    className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Shuffling Phase - Cards swapping animation */}
          {gamePhase === 'shuffling' && (
            <div className="p-6 flex justify-center items-center min-h-[250px] relative overflow-hidden">
              {/* Shuffle timer */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-white bg-opacity-80 rounded-full px-4 py-2 shadow-lg flex items-center">
                <Clock size={16} className="mr-2 text-game-primary" />
                <span className="font-bold text-game-primary">Shuffling: {shuffleTimeLeft}s</span>
              </div>
            
              {/* Left card moving right */}
              <div className="card-shuffle-left absolute w-44 h-64 rounded-lg shadow-lg">
                <img 
                  src={cardBackside} 
                  alt="Card back" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
              
              {/* Right card moving left */}
              <div className="card-shuffle-right absolute w-44 h-64 rounded-lg shadow-lg">
                <img 
                  src={cardBackside} 
                  alt="Card back" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
              
              <p className="absolute bottom-2 text-center text-gray-700 font-medium">
                Shuffling cards...
              </p>
            </div>
          )}
          
          {/* Selection Phase - One card remains, player must select who it is */}
          {gamePhase === 'selection' && (
            <div className="p-6 flex flex-col items-center min-h-[250px] relative">
              {/* Selection timer */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-yellow-100 border-2 border-yellow-400 rounded-full px-4 py-2 shadow-lg flex items-center">
                <Clock size={16} className="mr-2 text-yellow-700" />
                <span className="font-bold text-yellow-700">Select: {selectionTimeLeft}s</span>
              </div>
            
              {/* The final card */}
              <div className="w-44 h-64 rounded-lg shadow-xl mb-6 mt-10 rotate-y-180">
                <img 
                  src={cardBackside}
                  alt="Mystery card" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
              
              <p className="text-center font-bold text-lg text-indigo-900 mb-4">
                Who's behind the card?
              </p>
              
              {/* Player selection buttons */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button
                  onClick={() => selectPlayer('left')}
                  className={`bg-${leftPlayer.color.split('-')[1]}-600 hover:bg-${leftPlayer.color.split('-')[1]}-700 p-3 h-auto`}
                  disabled={playerSelection !== null}
                >
                  <div className="flex flex-col items-center">
                    <img 
                      src={leftPlayer.image} 
                      alt={leftPlayer.name} 
                      className="w-12 h-12 object-cover rounded-full mb-2 border-2 border-white" 
                    />
                    <span className="font-bold">{leftPlayer.name}</span>
                  </div>
                </Button>
                
                <Button
                  onClick={() => selectPlayer('right')}  
                  className={`bg-${rightPlayer.color.split('-')[1]}-600 hover:bg-${rightPlayer.color.split('-')[1]}-700 p-3 h-auto`}
                  disabled={playerSelection !== null}
                >
                  <div className="flex flex-col items-center">
                    <img 
                      src={rightPlayer.image} 
                      alt={rightPlayer.name} 
                      className="w-12 h-12 object-cover rounded-full mb-2 border-2 border-white" 
                    />
                    <span className="font-bold">{rightPlayer.name}</span>
                  </div>
                </Button>
              </div>
              
              {/* Selection indicator */}
              {playerSelection && (
                <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg border border-green-300 text-center">
                  <Check size={20} className="inline-block mr-2" />
                  You selected {playerSelection === 'left' ? leftPlayer.name : rightPlayer.name}
                </div>
              )}
            </div>
          )}
          
          {/* Results Phase */}
          {gamePhase === 'results' && (
            <div className="p-6 text-center">
              {playerSelection === winner ? (
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
                It was {winner === 'left' ? leftPlayer.name : rightPlayer.name}!
              </p>
              
              <div className={`p-4 mb-4 rounded-lg ${playerSelection === winner ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-100 text-red-800 border-2 border-red-300'}`}>
                {playerSelection === winner ? (
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
              
              <div className="text-sm text-gray-500 mb-4">
                Next game starts in {timeLeft} seconds...
              </div>
            </div>
          )}
          
          {/* Betting UI - only shown in initial or selection phase */}
          {(gamePhase === 'initial' || gamePhase === 'selection') && (
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
                  disabled={gamePhase === 'selection' && playerSelection !== null}
                />
                
                {gamePhase === 'initial' && (
                  <div className="text-sm text-center text-game-primary font-medium">
                    Cards will rotate in {Math.max(0, 38 - (45 - timeLeft))} seconds
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Results Phase - Play Again Button */}
          {gamePhase === 'results' && (
            <div className="p-4 bg-indigo-50 border-t border-indigo-100">
              <Button 
                onClick={startNewGame} 
                className="bg-game-primary hover:bg-game-primary/80 w-full transition-transform hover:scale-105 py-6 text-lg rounded-lg shadow-lg"
              >
                Play Again Now
              </Button>
            </div>
          )}
        </div>
        
        {/* Win chance info card */}
        {(gamePhase === 'initial' || gamePhase === 'selection') && (
          <div className="bg-white rounded-lg shadow-lg p-4 border border-indigo-100">
            <div className="flex items-center mb-2">
              <Trophy size={18} className="text-yellow-500 mr-2" />
              <h3 className="font-bold text-gray-800">Win Chance</h3>
            </div>
            <p className="text-sm text-gray-600">
              Select carefully and increase your winning chances! Winners get 2x their bet amount.
            </p>
          </div>
        )}
      </div>
      
      {/* Add custom CSS for animations */}
      <style >{`
        /* Card flip animation */
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        /* Card shuffle animation */
        .card-shuffle-left {
          animation: shuffle-left 2s infinite alternate;
        }
        
        .card-shuffle-right {
          animation: shuffle-right 2s infinite alternate;
        }
        
        @keyframes shuffle-left {
          0%, 100% { transform: translateX(-60px) rotateY(180deg); }
          50% { transform: translateX(60px) rotateY(180deg); }
        }
        
        @keyframes shuffle-right {
          0%, 100% { transform: translateX(60px) rotateY(180deg); }
          50% { transform: translateX(-60px) rotateY(180deg); }
        }
        
        /* Winner animation */
        .winner-animation {
          animation: winner-pulse 1s infinite alternate;
        }
        
        @keyframes winner-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); filter: drop-shadow(0 0 10px gold); }
        }
        
        .loser-animation {
          animation: loser-shake 1s;
          filter: grayscale(40%);
        }
        
        @keyframes loser-shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        
        /* Celebration animation */
        .celebration-animation {
          animation: celebrate 0.5s infinite alternate;
        }
        
        @keyframes celebrate {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }
        
        /* Timer circle pulsing */
        .timer-circle {
          animation: circle-pulse 1s infinite alternate;
        }
        
        @keyframes circle-pulse {
          0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
          100% { box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
        }
      `}</style>
    </div>
  );
};

export default CardGame;