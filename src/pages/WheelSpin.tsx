import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';

interface WheelSection {
  prize: string;
  color: string;
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
  { prize: '₹5', color: '#4CAF50' },
  { prize: 'Better luck next time', color: '#F44336' },
  { prize: '₹1,00,000', color: '#2196F3' },
  { prize: '₹50,000', color: '#FF9800' },
  { prize: 'iPhone 16', color: '#9C27B0' },
  { prize: 'Samsung Galaxy S25', color: '#009688' },
  { prize: 'MacBook', color: '#E91E63' },
  { prize: 'Activa Scooter', color: '#FFEB3B' },
];

const WheelSpin = () => {
  const [spinning, setSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [hasSpinChance, setHasSpinChance] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const spinCost = 100;
  const totalSections = wheelSections.length;
  const sectionAngle = 360 / totalSections;

  // Load wallet data from localStorage on component mount
  useEffect(() => {
    const storedBalance = localStorage.getItem('walletBalance');
    const hasSpun = localStorage.getItem('hasSpunToday');
    
    if (storedBalance) {
      setWalletBalance(parseInt(storedBalance));
    }
    
    // Check if user has already used their daily spin
    if (hasSpun === 'true') {
      setHasSpinChance(false);
    } else {
      // Only allow spin if they have money in their wallet
      setHasSpinChance(parseInt(storedBalance || '0') > 0);
    }
  }, []);

  const spinWheel = () => {
    if (spinning || !canSpin || !hasSpinChance) return;

    if (walletBalance < spinCost) {
      toast.error('Insufficient balance. Please deposit to continue.');
      navigate('/wallet');
      return;
    }

    // Deduct spin cost from wallet
    const newBalance = walletBalance - spinCost;
    setWalletBalance(newBalance);
    localStorage.setItem('walletBalance', newBalance.toString());
    
    setSpinning(true);
    setCanSpin(false);
    setSpinResult(null);

    // Determine outcome - only ₹5 or Better luck next time
    const outcome = Math.random() <= 0.2 ? '₹5' : 'Better luck next time';
    const outcomeIndex = wheelSections.findIndex(s => s.prize === outcome);

    if (outcomeIndex === -1) {
      console.error('Invalid outcome:', outcome);
      return;
    }

    // Calculate final position with randomness within the section
    const minSpins = 5;
    const sectionStart = outcomeIndex * sectionAngle;
    
    // Random position within the section (between 20% and 80% of section)
    const randomOffset = sectionAngle * (0.2 + Math.random() * 0.6);
    const targetPosition = 360 - (sectionStart + randomOffset); 
    
    // Calculate the final rotation to have the wheel stop within the selected section
    const newRotation = minSpins * 360 + targetPosition;
    
    setWheelRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setSpinResult(outcome);

      // Mark that user has used their daily spin
      localStorage.setItem('hasSpunToday', 'true');
      setHasSpinChance(false);

      if (outcome === '₹5') {
        // Add winnings to wallet
        const updatedBalance = newBalance + 5;
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
      const skew = 90 - sectionAngle; // Corrected skew calculation

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
              transform: `skewY(${skew}deg) rotate(${sectionAngle / 2}deg)` // Adjusted for better text alignment
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
        
        <div className="wheel-wrapper relative mx-auto w-80 h-80 mb-8">
          {/* Moved wheel arrow inside */}
          <div
            ref={wheelRef}
            className="wheel relative w-full h-full rounded-full overflow-hidden transition-transform duration-5000 ease-out"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transition: spinning 
                ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' 
                : 'none',
            }}
          >
            {renderWheel()}
          </div>
          
          <div className="wheel-arrow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6">
            <div className="w-0 h-0 border-solid border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-500 mx-auto"></div>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-2">Wallet: ₹{walletBalance}</p>
          <p className="mb-4">Spin Cost: ₹{spinCost}</p>
          
          {!hasSpinChance && walletBalance === 0 ? (
            <Button 
              onClick={() => navigate('/wallet')}
              className="bg-game-primary hover:bg-game-primary/90 px-12 py-6 text-lg"
            >
              Deposit to Spin
            </Button>
          ) : !hasSpinChance ? (
            <div className="text-center mb-4">
              <p className="text-red-500 mb-4">You've used your spin for today!</p>
              <Button 
                onClick={() => navigate('/wallet')}
                className="bg-game-primary hover:bg-game-primary/90"
              >
                Go to Wallet
              </Button>
            </div>
          ) : (
            <Button 
              onClick={spinWheel} 
              disabled={!canSpin || spinning || !hasSpinChance}
              className="bg-game-primary hover:bg-game-primary/90 px-12 py-6 text-lg"
            >
              {spinning ? 'Spinning...' : 'Spin Now'}
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
        .wheel-wrapper {
          perspective: 1000px;
          position: relative;
        }
        
        .wheel-section {
          position: absolute;
          width: 50%;
          height: 50%;
          right: 0;
          top: a0;
          transform-origin: 0% 100%;
          overflow: hidden;
        }
        
        .wheel-label {
          position: absolute;
          left: -100%;
          width: 200%;
          height: 200%;
          text-align: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 30%;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .wheel-arrow {
          z-index: 10;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .border-b-16 {
          border-bottom-width: 16px;
        }
      `}</style>
    </div>
  );
};

export default WheelSpin;