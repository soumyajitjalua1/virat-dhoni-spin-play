import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';


interface WheelSection {
  prize: string;
  color: string;
  textColor: string;
}

// Modify or create this type in your project to match Wallet transactions
interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

const wheelSections: WheelSection[] = [
  { prize: '₹5', color: '#D32F2F', textColor: 'white' },
  { prize: 'Better luck next time', color: '#F9F6F0', textColor: 'black' },
  { prize: '₹1,00,000', color: '#D32F2F', textColor: 'white' },
  { prize: '₹50,000', color: '#F9F6F0', textColor: 'black' },
  { prize: 'iPhone 16', color: '#D32F2F', textColor: 'white' },
  { prize: 'Samsung Galaxy S25', color: '#F9F6F0', textColor: 'black' },
  { prize: 'MacBook', color: '#D32F2F', textColor: 'white' },
  { prize: 'Activa Scooter', color: '#F9F6F0', textColor: 'black' },
];

const WheelSpin = () => {
  const [spinning, setSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [freeSpinUsed, setFreeSpinUsed] = useState(false);
  const navigate = useNavigate();
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const spinCost = 5; // Changed from 100 to 5
  const maxDailySpins = 5;
  const totalSections = wheelSections.length;
  const sectionAngle = 360 / totalSections;

  // Load wallet data from localStorage on component mount
  useEffect(() => {
    const storedBalance = localStorage.getItem('walletBalance');
    const storedSpinsRemaining = localStorage.getItem('spinsRemaining');
    const storedFreeSpinUsed = localStorage.getItem('freeSpinUsed');
    
    // Reset spins at the start of a new day
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    
    if (lastSpinDate !== today) {
      // New day, reset spin count
      localStorage.setItem('spinsRemaining', maxDailySpins.toString());
      localStorage.setItem('lastSpinDate', today);
      localStorage.setItem('freeSpinUsed', 'false');
      setSpinsRemaining(maxDailySpins);
      setFreeSpinUsed(false);
    } else {
      // Same day, load previous values
      if (storedSpinsRemaining) {
        setSpinsRemaining(parseInt(storedSpinsRemaining));
      } else {
        setSpinsRemaining(maxDailySpins);
        localStorage.setItem('spinsRemaining', maxDailySpins.toString());
      }
      
      setFreeSpinUsed(storedFreeSpinUsed === 'true');
    }
    
    if (storedBalance) {
      setWalletBalance(parseInt(storedBalance));
    }
  }, []);

  const spinWheel = (useFree = false) => {
    if (spinning || !canSpin) return;
    
    if (spinsRemaining <= 0) {
      toast.error('You\'ve used all your spins for today!');
      return;
    }

    // Check if this is a free spin or a paid spin
    if (!useFree && !freeSpinUsed && walletBalance > 0) {
      // User has a free spin available
      toast.info('Using your free spin!');
      setFreeSpinUsed(true);
      localStorage.setItem('freeSpinUsed', 'true');
    } else if (walletBalance < spinCost) {
      toast.error('Insufficient balance. Please deposit to continue.');
      navigate('/wallet');
      return;
    } else {
      // Deduct spin cost from wallet
      const newBalance = walletBalance - spinCost;
      setWalletBalance(newBalance);
      localStorage.setItem('walletBalance', newBalance.toString());
    }
    
    // Decrease remaining spins
    const newSpinsRemaining = spinsRemaining - 1;
    setSpinsRemaining(newSpinsRemaining);
    localStorage.setItem('spinsRemaining', newSpinsRemaining.toString());
    localStorage.setItem('lastSpinDate', new Date().toDateString());
    
    setSpinning(true);
    setCanSpin(false);
    setSpinResult(null);

    // Reset wheel rotation to allow for consistent spinning experience
    setWheelRotation(0);

    // Determine outcome - only ₹5 or Better luck next time
    const outcome = Math.random() <= 0.2 ? '₹5' : 'Better luck next time';
    const outcomeIndex = wheelSections.findIndex(s => s.prize === outcome);

    if (outcomeIndex === -1) {
      console.error('Invalid outcome:', outcome);
      return;
    }

    // Calculate final position with randomness within the section
    const minSpins = 5; // Minimum number of full rotations
    const sectionStart = outcomeIndex * sectionAngle;
    
    // Random position within the section (between 20% and 80% of section)
    const randomOffset = sectionAngle * (0.2 + Math.random() * 0.6);
    const targetPosition = 360 - (sectionStart + randomOffset); 
    
    // Calculate the final rotation to have the wheel stop within the selected section
    const newRotation = minSpins * 360 + targetPosition;
    
    // Small delay to ensure the wheel reset is processed before starting the new spin
    setTimeout(() => {
      setWheelRotation(newRotation);
    }, 10);

    // Handle the result after the wheel stops spinning
    setTimeout(() => {
      setSpinning(false);
      setSpinResult(outcome);

      // Calculate the new balance based on previous deduction
      const currentBalance = walletBalance - (useFree || (!useFree && !freeSpinUsed) ? 0 : spinCost);

      if (outcome === '₹5') {
        // Add winnings to wallet
        const updatedBalance = currentBalance + 5;
        setWalletBalance(updatedBalance);
        localStorage.setItem('walletBalance', updatedBalance.toString());
        
        // Add transaction to history
        addTransactionToHistory('Game Win', 5);
        
        toast.success('You won ₹5! Added to your wallet.');
      } else {
        toast.info('Better luck next time!');
      }

      setCanSpin(true);
    }, 5000);
  };

  // Add transaction to history in localStorage
  const addTransactionToHistory = (type: string, amount: number) => {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10) + ' ' + 
                      now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
                      
    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount,
      date: dateString,
      status: 'Success'
    };
    
    // Get existing transactions
    const existingTransactionsJSON = localStorage.getItem('transactions') || '[]';
    const existingTransactions: Transaction[] = JSON.parse(existingTransactionsJSON);
    
    // Add new transaction
    const updatedTransactions = [newTransaction, ...existingTransactions];
    
    // Save back to localStorage
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const renderWheel = () => {
    return wheelSections.map((section, index) => {
      const rotate = index * sectionAngle;
      const skew = 90 - sectionAngle;

      return (
        <div
          key={index}
          className="wheel-section"
          style={{
            transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
            backgroundColor: section.color,
          }}
        >
          <div 
            className="wheel-label"
            style={{
              transform: `skewY(${skew}deg) rotate(${sectionAngle / 2}deg)`,
              color: section.textColor
            }}
          >
            {section.prize.split(' ').map((word, i) => (
              <div key={i}>{word}</div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen pb-6 bg-gray-100">
      <AppHeader />
      
      <div className="p-4">
        <Link to="/" className="text-game-primary font-medium flex items-center mb-4">
          ← Back to Home
        </Link>
        
        <h1 className="text-2xl font-bold text-center mb-4">Spin & Win</h1>
        
        <div className="wheel-container relative mx-auto mb-8">
          {/* Wheel wrapper with gold border */}
          <div className="wheel-wrapper relative mx-auto">
            <div
              ref={wheelRef}
              className="wheel relative w-full h-full rounded-full overflow-hidden"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transition: spinning 
                  ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' 
                  : 'transform 0s',
              }}
            >
              {renderWheel()}
            </div>
            
            {/* Right-side pointer */}
            <div className="wheel-pointer">
              <div className="wheel-arrow"></div>
            </div>
            
            {/* Center hub with arrow */}
            <div className="wheel-center">
              <div className="center-arrow"></div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="wheel-info p-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg shadow-md mb-6 border border-amber-400">
            <p className="text-xl font-bold mb-2">Your Wallet: ₹{walletBalance}</p>
            <p className="text-lg">Spin Cost: ₹{spinCost}</p>
            <p className="text-lg">Spins Remaining Today: {spinsRemaining}</p>
            {!freeSpinUsed && walletBalance > 0 && <p className="text-green-600 font-bold mt-2">You have 1 FREE spin!</p>}
          </div>
          
          {walletBalance === 0 && spinsRemaining > 0 ? (
            <Button 
              onClick={() => navigate('/wallet')}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 px-12 py-6 text-lg shadow-lg font-bold text-white"
            >
              Deposit to Spin
            </Button>
          ) : spinsRemaining <= 0 ? (
            <div className="text-center mb-4">
              <p className="text-red-500 font-bold mb-4">You've used all your spins for today!</p>
              <Button 
                onClick={() => navigate('/wallet')}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg font-bold text-white"
              >
                Go to Wallet
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => spinWheel(!freeSpinUsed && walletBalance > 0)} 
              disabled={!canSpin || spinning || spinsRemaining <= 0}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 px-12 py-6 text-lg shadow-lg font-bold text-white"
            >
              {spinning ? 'Spinning...' : !freeSpinUsed && walletBalance > 0 ? 'FREE SPIN!' : 'Spin Now'}
            </Button>
          )}
        </div>

        {spinResult && (
          <div className="mt-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Result:</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg inline-block">
              <p className="text-xl font-semibold text-game-primary">
                {spinResult}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .wheel-container {
          width: 320px;
          height: 320px;
          position: relative;
          margin: 0 auto;
          filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15));
          animation: wheel-glow 3s infinite alternate;
        }
        
        @keyframes wheel-glow {
          from { filter: drop-shadow(0 15px 15px rgba(0, 0, 0, 0.15)); }
          to { filter: drop-shadow(0 15px 30px rgba(212, 175, 55, 0.5)); }
        }
        
        .wheel-wrapper {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(to right, #D4AF37 0%, #FBE582 20%, #D4AF37 40%, #FBE582 60%, #D4AF37 80%, #FBE582 100%);
          padding: 10px;
          box-shadow: 0 0 0 4px #D4AF37, 0 0 0 8px #8B7513, 0 10px 20px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          position: relative;
          perspective: 1000px;
        }
        
        .wheel-section {
          position: absolute;
          width: 50%;
          height: 50%;
          right: 0;
          top: 0;
          transform-origin: 0% 100%;
          overflow: hidden;
          border: 2px solid rgba(0, 0, 0, 0.15);
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .wheel-label {
          position: absolute;
          left: -100%;
          width: 230%;
          height: 200%;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 30%;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .wheel-pointer {
          position: absolute;
          top: 0;
          right: -10px;
          height: 100%;
          display: flex;
          align-items: center;
          z-index: 11;
        }
        
        .wheel-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, #111 0%, #333 100%);
          border-radius: 50%;
          border: 6px solid #D4AF37;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .center-arrow {
          position: absolute;
          width: 10px;
          height: 40px;
          background-color:rgb(255, 255, 25);
          right: 18px;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform: rotate(188deg);
          z-index: 12;
          top: -16px;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
        }
        
        .wheel-arrow {
          position: absolute;
          z-index: 11;
          right: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 36px;
          background-color: #D32F2F;
          clip-path: polygon(0 0, 0 100%, 100% 50%);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WheelSpin;