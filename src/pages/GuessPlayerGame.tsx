import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaQuestionCircle, FaWallet, FaTrophy, FaHistory, FaInfoCircle } from 'react-icons/fa';

// Define types
type Player = {
  name: string;
  image: string;
  avgScore: number;
  playerWinnings: number;
  recentPerformance?: string[];
};

type GameOption = {
  id: string;
  duration: string;
  displayDuration: string;
  durationInSeconds: number;
  player1: Player;
  player2: Player;
};

type Transaction = {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
};

// Main App Component
const CricketBettingGame = () => {
  const [walletBalance, setWalletBalance] = useState<number>(1000);
  const [selectedGame, setSelectedGame] = useState<string>('winGo30sec');
  const [selectedMultiplier, setSelectedMultiplier] = useState<number>(1);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(45);
  const [finalCountdown, setFinalCountdown] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string>(`202505${Math.floor(Math.random() * 1000000)}`);
  const [betAmount, setBetAmount] = useState<number>(100);
  const [botBetAmount, setBotBetAmount] = useState<number>(0);
  const [gameResult, setGameResult] = useState<{ winner: string | null, amount: number | null } | null>(null);
  const [showNewGamePopup, setShowNewGamePopup] = useState<boolean>(false);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Game options with enhanced player data
  const gameOptions: Record<string, GameOption> = {
    winGo30sec: {
      id: "winGo30sec",
      duration: "30sec",
      displayDuration: "45sec",
      durationInSeconds: 45,
      player1: {
        name: "Virat",
        image: "/Card 1.webp",
        avgScore: 190,
        playerWinnings: 0,
        recentPerformance: ["W", "W", "L", "W", "W"]
      },
      player2: {
        name: "Babar",
        image: "/Card 5.webp",
        avgScore: 97,
        playerWinnings: 93.2,
        recentPerformance: ["W", "L", "W", "L", "W"]
      }
    },
    winGo1Min: {
      id: "winGo1Min",
      duration: "1Min",
      displayDuration: "1 Min",
      durationInSeconds: 60,
      player1: {
        name: "Virat", 
        image: "Card 1.webp",
        avgScore: 190,
        playerWinnings: 0,
        recentPerformance: ["W", "W", "L", "W", "W"]
      },
      player2: {
        name: "Dhoni",
        image: "Card 2.webp",
        avgScore: 97,
        playerWinnings: 93.2,
        recentPerformance: ["W", "W", "W", "L", "W"]
      }
    },
    winGo3Min: {
      id: "winGo3Min",
      duration: "3Min",
      displayDuration: "3 Min",
      durationInSeconds: 180,
      player1: {
        name: "Virat", 
        image: "Card 1.webp",
        avgScore: 190,
        playerWinnings: 0,
        recentPerformance: ["W", "W", "L", "W", "W"]
      },
      player2: {
        name: "Rohit",
        image: "Card 3.webp",
        avgScore: 97,
        playerWinnings: 93.2,
        recentPerformance: ["L", "W", "W", "W", "L"]
      }
    },
    winGo5Min: {
      id: "winGo5Min",
      duration: "5Min",
      displayDuration: "5 Min",
      durationInSeconds: 300,
      player1: {
        name: "Virat", 
        image: "/Card 1.webp",
        avgScore: 190,
        playerWinnings: 0,
        recentPerformance: ["W", "W", "L", "W", "W"]
      },
      player2: {
        name: "Gill",
        image: "/Card 4.webp",
        avgScore: 97,
        playerWinnings: 93.2,
        recentPerformance: ["W", "L", "L", "W", "W"]
      }
    }
  };

  // Load wallet balance and transactions from localStorage on mount
useEffect(() => {
  // Load the wallet balance (or set default if not found)
  const storedBalance = localStorage.getItem('walletBalance');
  if (storedBalance) {
    setWalletBalance(parseFloat(storedBalance));
  } else {
    // Only initialize with default amount if no balance exists
    setWalletBalance(1000);
    localStorage.setItem('walletBalance', '1000');
  }
  
  // Load transaction history
  const storedTransactions = localStorage.getItem('transactions');
  if (storedTransactions) {
    setTransactions(JSON.parse(storedTransactions));
  } else {
    // Initialize with sample data if no transactions exist
    const initialTransactions = [
      { id: 1, type: "Deposit", amount: 500, date: "2024-05-16 14:30", status: "Success" },
      { id: 2, type: "Withdrawal", amount: 200, date: "2024-05-15 10:15", status: "Success" },
      { id: 3, type: "Game Win", amount: 700, date: "2024-05-14 18:45", status: "Success" }
    ];
    setTransactions(initialTransactions);
    localStorage.setItem('transactions', JSON.stringify(initialTransactions));
  }
}, []);

// Function to update wallet balance after a game or transaction
const updateWalletBalance = (amount, transactionType) => {
  // Calculate new balance
  const newBalance = walletBalance + amount;
  
  // Update state
  setWalletBalance(newBalance);
  
  // Save to localStorage
  localStorage.setItem('walletBalance', newBalance.toString());
  
  // Add to transaction history
  const newTransaction = {
    id: transactions.length + 1,
    type: transactionType, // "Game Win", "Game Loss", "Deposit", "Withdrawal", etc.
    amount: Math.abs(amount),
    date: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ''),
    status: "Success"
  };
  
  const updatedTransactions = [...transactions, newTransaction];
  setTransactions(updatedTransactions);
  localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
};

// updateWalletBalance(100, "Deposit");

  // Update wallet balance in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('walletBalance', walletBalance.toString());
  }, [walletBalance]);

  // Set initial time remaining when game changes
  useEffect(() => {
    const currentGame = gameOptions[selectedGame];
    setTimeRemaining(currentGame.durationInSeconds);
    setFinalCountdown(false);
  }, [selectedGame]);

  // Handle wallet operations
  const handleWalletAction = (action: 'deposit' | 'withdraw') => {
    navigate(`/wallet?action=${action}`);
  };

  // Handle game selection
  const handleGameSelection = (gameId: string) => {
    setSelectedGame(gameId);
    // Reset player selection when game changes
    setSelectedPlayer(null);
    setCountdown(null);
    setTimeRemaining(gameOptions[gameId].durationInSeconds);
    setGameResult(null);
    setBotBetAmount(0);
    setFinalCountdown(false);
  };

  // Handle bet amount change
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setBetAmount(value);
  };

  // Quick bet amount selection
  const handleQuickBetAmount = (amount: number) => {
    setBetAmount(Math.min(amount, walletBalance));
  };

  // Place bet
   // Place bet
  const placeBet = () => {
    if (!selectedPlayer || betAmount <= 0 || betAmount > walletBalance) return;
    
    // Deduct bet amount from wallet
    setWalletBalance(prev => prev - betAmount);
    
    // Update transactions
    const newTransaction = {
      id: Date.now(),
      type: "Bet Placed",
      amount: betAmount,
      date: new Date().toLocaleString(),
      status: "Success"
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Bot always bets on OPPOSITE player compared to the user
    const currentGame = gameOptions[selectedGame];
    const botPlayer = selectedPlayer === currentGame.player1.name ? currentGame.player2.name : currentGame.player1.name;
    
    // Bot usually bets less (90% chance) than the user
    const botBetsLess = Math.random() < 0.9;
    const botAmount = botBetsLess 
      ? Math.floor(betAmount * 0.5) + Math.floor(Math.random() * 20)
      : betAmount + Math.floor(Math.random() * 100) + 10;
    
    setBotBetAmount(botAmount);
    
    // Start countdown if we're not already in the final countdown
    if (!finalCountdown) {
      setCountdown(10);
    }
    
    // Track games played
    setGamesPlayed(prev => prev + 1);
  };

  // Countdown timer effect for bet resolution
  useEffect(() => {
    if (countdown === null) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          
          // When countdown ends, determine winner
          if (selectedPlayer) {
            const currentGame = gameOptions[selectedGame];
            const opponent = selectedPlayer === currentGame.player1.name ? currentGame.player2.name : currentGame.player1.name;
            
            // Logic to determine winner
            let userWins = false;
            
            if (gamesPlayed === 1) {
              // First game, user always wins
              userWins = true;
            } else {
              // Base win probability on multiplier and who bet less
              let winProbability;
              
              // First determine if user bet less than bot
              const userBetLess = betAmount < botBetAmount;
              
              // Adjust win probability based on multiplier
              switch(selectedMultiplier) {
                case 1:
                  winProbability = userBetLess ? 0.8 : 0.2;
                  break;
                case 5:
                  winProbability = userBetLess ? 0.3 : 0.05;
                  break;
                case 10:
                  winProbability = userBetLess ? 0.1 : 0.02;
                  break;
                case 20:
                  winProbability = 0.01;
                  break;
                case 50:
                case 100:
                  winProbability = 0.002; // 0.2% chance
                  break;
                default:
                  winProbability = 0.01;
              }
              
              userWins = Math.random() < winProbability;
            }
            
            const winner = userWins ? selectedPlayer : opponent;
            
            // Calculate winnings (multiplier effect for winnings)
            const winAmount = userWins ? betAmount * selectedMultiplier * 2 : 0;
            
            // Add winnings to wallet and update transactions
            if (userWins) {
              setWalletBalance(prev => prev + winAmount);

              // Add winning transaction
              const winTransaction = {
                id: Date.now(),
                type: "Game Win",
                amount: winAmount,
                date: new Date().toLocaleString(),
                status: "Success"
              };
              
              const updatedTransactions = [winTransaction, ...transactions];
              setTransactions(updatedTransactions);
              localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
            }
            
            // Show results
            setGameResult({ winner, amount: userWins ? winAmount : null });
            
            // Show new game popup after 5 seconds
            setTimeout(() => {
              setShowNewGamePopup(true);
              
              // Hide popup and start new game after 2 seconds
              setTimeout(() => {
                setShowNewGamePopup(false);
                setSelectedPlayer(null);
                setGameResult(null);
                setBotBetAmount(0);
                setFinalCountdown(false);
                
                // Generate a new game ID
                const newGameId = `202505${Math.floor(Math.random() * 1000000)}`;
                setGameId(newGameId);
                
                // Reset time remaining
                setTimeRemaining(gameOptions[selectedGame].durationInSeconds);
              }, 2000);
            }, 3000);
          }
          
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, selectedPlayer, betAmount, selectedMultiplier, gamesPlayed, selectedGame, transactions]);

  // Timer for "Time remaining" display
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (countdown !== null || gameResult !== null) {
          // Pause countdown when game is in progress or showing results
          return prevTime;
        }
        
        if (prevTime <= 0) {
          // Generate a new game ID when timer resets
          const newGameId = `202505${Math.floor(Math.random() * 1000000)}`;
          setGameId(newGameId);
          setFinalCountdown(false);
          return gameOptions[selectedGame].durationInSeconds; // Reset to initial time based on selected game
        }
        
        // When time remaining reaches 10 seconds, trigger final countdown if not already in that state
        if (prevTime === 10 && !finalCountdown && !countdown) {
          setFinalCountdown(true);
          setCountdown(10);
        }
        
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, selectedGame, gameResult, finalCountdown]);

  // Format time for display (00:20)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get the currently selected game
  const currentGame = gameOptions[selectedGame];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 text-gray-800">
      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How to Play</h2>
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="prose">
              <h3>Game Rules:</h3>
              <ol className="list-decimal pl-5">
                <li>Select a game duration (30sec, 1min, 3min, or 5min)</li>
                <li>Choose a player you think will win</li>
                <li>Enter your bet amount or use quick bet options</li>
                <li>Select a multiplier (higher multiplier = higher potential winnings)</li>
                <li>Place your bet and wait for the countdown</li>
                <li>When the timer reaches zero, a winner will be determined</li>
                <li>If your player wins, you'll receive your bet amount × multiplier × 2</li>
              </ol>
              
              <h3 className="mt-4">Tips:</h3>
              <ul className="list-disc pl-5">
                <li>Watch player performance trends to make informed bets</li>
                <li>Start with smaller bets to understand the game dynamics</li>
                <li>Remember that luck plays a role in outcomes</li>
                <li>Manage your wallet balance wisely</li>
              </ul>
            </div>
            
            <button 
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Header with back button */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-b-xl p-4 mb-2 flex items-center">
        <FaArrowLeft className="text-xl cursor-pointer mr-4 text-blue-600" onClick={() => navigate(-1)}/>
        <div className="text-xl font-bold flex-1 text-center">Cricket Betting Game</div>
        <FaQuestionCircle 
          className="text-xl text-blue-600 cursor-pointer" 
          onClick={() => setIsHelpModalOpen(true)}
        />
      </div>
      
      {/* Wallet Balance Section */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 mb-2">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <FaWallet className="text-blue-600 text-xl" />
                <span className="text-2xl font-bold">₹{walletBalance.toFixed(2)}</span>
              </div>
              <p className="text-blue-600 text-sm">Wallet balance</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-500">Game ID: {gameId}</p>
              <p className="text-sm text-gray-500">Games Played: {gamesPlayed}</p>
            </div>
          </div>
          
          <div className="flex w-full gap-4">
            <button 
              onClick={() => handleWalletAction('withdraw')}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Withdraw
            </button>
            <button 
              onClick={() => handleWalletAction('deposit')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Deposit
            </button>
          </div>
        </div>
      </div>
      
      {/* Notification Banner */}
      <div className="w-full max-w-md bg-white p-3 rounded-xl mb-2 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <FaInfoCircle className="text-blue-600 mr-2" />
          <p className="text-sm">Always use our official website for playing and secure transactions</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-lg text-sm">
          Info
        </button>
      </div>
      
      {/* Game Options */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-md mb-2">
        {Object.entries(gameOptions).map(([id, game]) => (
          <button
            key={id}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors shadow-md ${
              selectedGame === id 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => handleGameSelection(id)}
          >
            <div className={`rounded-full p-2 mb-1 ${selectedGame === id ? 'bg-blue-500' : 'bg-blue-100'}`}>
              <svg className={`w-5 h-5 ${selectedGame === id ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium">WinGo</span>
            <span className="text-xs font-bold">{game.displayDuration}</span>
          </button>
        ))}
      </div>
      
      {/* Game Panel */}
      <div className="w-full max-w-md bg-white rounded-xl p-4 mb-2 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <button 
            className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <FaQuestionCircle className="mr-2" />
            How to play
          </button>
          <div className="text-gray-800">
            <p className="text-xs text-center mb-1">Time remaining</p>
            <div className="flex">
              {formatTime(timeRemaining).split('').map((char, index) => (
                <div key={index} className={`w-8 h-10 flex items-center justify-center ${char === ':' ? 'bg-transparent text-gray-800 text-xl font-bold' : 'bg-blue-600 text-white rounded shadow-md'} mx-0.5`}>
                  {char}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="text-sm mb-2 font-bold">WinGo {currentGame.displayDuration} - Recent Results</div>
          <div className="flex justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md">1</div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md">5</div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">8</div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">6</div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">8</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <FaTrophy className="text-yellow-500" />
              <span className="text-xs font-medium">Today's Top Winner: ₹12,500</span>
            </div>
            <div className="flex gap-1">
              <FaHistory className="text-blue-500" />
              <span className="text-xs font-medium">Total Bets: 4,328</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Player Selection */}
      <div className="w-full max-w-md bg-white rounded-xl p-4 mb-2 relative shadow-lg">
        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{countdown}</div>
              <div className="text-xl text-yellow-300">Game In Progress</div>
            </div>
          </div>
        )}
        
        {/* Game result overlay */}
        {gameResult !== null && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-xl">
            <div className={`text-5xl font-bold mb-4 ${gameResult.winner === selectedPlayer ? 'text-yellow-300' : 'text-red-500'}`}>
              {gameResult.winner === selectedPlayer ? 'YOU WIN!' : 'YOU LOSE!'}
            </div>
            {gameResult.amount !== null ? (
              <div className="text-3xl font-bold text-green-400">+₹{gameResult.amount.toFixed(2)}</div>
            ) : (
              <div className="text-3xl font-bold text-red-400">Better luck next time!</div>
            )}
          </div>
        )}
        
        {/* New game popup */}
        {showNewGamePopup && (
          <div className="absolute inset-0 bg-blue-900 bg-opacity-90 flex items-center justify-center z-20 rounded-xl">
            <div className="text-5xl font-bold text-white animate-pulse">NEW GAME</div>
          </div>
        )}
        
        <div className="flex">
          {/* Player 1 */}
          <div 
            className={`w-1/2 ${selectedPlayer === currentGame.player1.name ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-yellow-50'} p-3 rounded-l-xl cursor-pointer transition-all duration-300`}
            onClick={() => setSelectedPlayer(currentGame.player1.name)}
          >
            <div className="text-center font-bold mb-1 text-yellow-700 text-lg">TEAM {currentGame.player1.name.toUpperCase()}</div>
            <div className="relative h-44 overflow-hidden rounded-xl mb-2 shadow-md">
              <img src={currentGame.player1.image} alt={currentGame.player1.name} className="w-full h-full object-cover" />
              
              {/* Performance indicator */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 py-1 px-2">
                <div className="flex justify-center gap-1">
                  {currentGame.player1.recentPerformance?.map((result, index) => (
                    <span key={index} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${result === 'W' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-200 rounded-lg p-2 mb-2 shadow-sm">
              <div className="flex justify-between text-sm mb-1 text-gray-700">
                <span>Avg. Score</span>
                <span className="font-bold">{currentGame.player1.avgScore}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Player Winnings</span>
                <span className="font-bold">₹{currentGame.player1.playerWinnings}</span>
              </div>
            </div>
            
            {selectedPlayer === currentGame.player1.name && botBetAmount > 0 && (
              <div className="mt-2 bg-yellow-300 p-2 rounded-lg text-center text-sm animate-pulse shadow-md">
                <p className="font-bold">Bot's Bet: ₹{botBetAmount}</p>
              </div>
            )}
          </div>
          
          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-red-600 text-white text-2xl font-bold p-2 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-4 border-white">VS</div>
          </div>
          
          {/* Player 2 */}
          <div 
            className={`w-1/2 ${selectedPlayer === currentGame.player2.name ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-blue-50'} p-3 rounded-r-xl cursor-pointer transition-all duration-300`}
            onClick={() => setSelectedPlayer(currentGame.player2.name)}
          >
            <div className="text-center font-bold mb-1 text-blue-700 text-lg">TEAM {currentGame.player2.name.toUpperCase()}</div>
            <div className="relative h-44 overflow-hidden rounded-xl mb-2 shadow-md">
              <img src={currentGame.player2.image} alt={currentGame.player2.name} className="w-full h-full object-cover" />
              
              {/* Performance indicator */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 py-1 px-2">
                <div className="flex justify-center gap-1">
                  {currentGame.player2.recentPerformance?.map((result, index) => (
                    <span key={index} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${result === 'W' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-200 rounded-lg p-2 mb-2 shadow-sm">
              <div className="flex justify-between text-sm mb-1 text-gray-700">
                <span>Avg. Score</span>
                <span className="font-bold">{currentGame.player2.avgScore}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Player Winnings</span>
                <span className="font-bold">₹{currentGame.player2.playerWinnings}</span>
              </div>
            </div>
            
            {selectedPlayer === currentGame.player2.name && botBetAmount > 0 && (
              <div className="mt-2 bg-blue-300 p-2 rounded-lg text-center text-sm animate-pulse shadow-md">
                <p className="font-bold">Bot's Bet: ₹{botBetAmount}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bet Amount Input */}
      {selectedPlayer && countdown === null && gameResult === null && (
        <div className="w-full max-w-md bg-white rounded-xl p-4 mb-2 shadow-lg">
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Place your bet (₹):
            </label>
            <input 
              type="number" 
              value={betAmount}
              onChange={handleBetAmountChange}
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max={walletBalance}
            />
          </div>
          
          {/* Quick bet buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[100, 500, 1000, Math.floor(walletBalance)].map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickBetAmount(amount)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                ₹{amount}
              </button>
            ))}
          </div>
          
          <button
            onClick={placeBet}
            disabled={betAmount <= 0 || betAmount > walletBalance}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md ${
              betAmount <= 0 || betAmount > walletBalance ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Place Bet on {selectedPlayer}
          </button>
        </div>
      )}
      
      {/* Bet Multiplier Controls */}
      <div className="w-full max-w-md mb-2">
        <div className="bg-white rounded-xl p-3 shadow-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">Select Multiplier</p>
          <div className="grid grid-cols-7 gap-2">
            <button 
              className="bg-purple-500 hover:bg-purple-600 py-2 rounded-lg text-center text-white font-bold shadow-md"
              onClick={() => setSelectedMultiplier(Math.floor(Math.random() * 100) + 1)}
            >
              Random
            </button>
            {[1, 5, 10, 20, 50, 100].map(multiplier => (
              <button 
                key={multiplier}
                className={`${
                  selectedMultiplier === multiplier 
                    ? 'bg-green-500 text-white ring-2 ring-green-300' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } py-2 rounded-lg text-center font-bold shadow-md transition-all`}
                onClick={() => setSelectedMultiplier(multiplier)}
              >
                X{multiplier}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recently Played & Transaction History */}
      <div className="w-full max-w-md bg-white rounded-xl p-4 mb-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Recent Transactions</h3>
          <button 
            className="text-blue-600 text-sm font-medium"
            onClick={() => navigate('/transaction-history')}
          >
            View All
          </button>
        </div>
        
        <div className="max-h-48 overflow-y-auto">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="border-b border-gray-100 py-2 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    transaction.type.includes('Win') ? 'bg-green-500' : 
                    transaction.type.includes('Bet') ? 'bg-yellow-500' : 
                    transaction.type.includes('Deposit') ? 'bg-blue-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium">{transaction.type}</span>
                </div>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
              <div className={`font-bold ${
                transaction.type.includes('Win') || transaction.type.includes('Deposit') 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {transaction.type.includes('Win') || transaction.type.includes('Deposit') 
                  ? '+' 
                  : '-'}
                ₹{transaction.amount.toFixed(2)}
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="w-full max-w-md bg-white rounded-t-xl shadow-lg p-3 fixed bottom-0 left-1/2 transform -translate-x-1/2 grid grid-cols-5">
        <button className="flex flex-col items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center">
          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
          <span className="text-xs mt-1">Games</span>
        </button>
        <button className="flex flex-col items-center justify-center">
          <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center -mt-4 shadow-lg border-4 border-white">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1">Bet</span>
        </button>
        <button className="flex flex-col items-center justify-center">
          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span className="text-xs mt-1">History</span>
        </button>
        <button className="flex flex-col items-center justify-center">
          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
          <span className="text-xs mt-1" >Profile</span>
        </button>
      </div>
    </div>
  );
};

export default CricketBettingGame;