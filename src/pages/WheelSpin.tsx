
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';

interface WheelSection {
  prize: string;
  color: string;
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
  const [spinning, setSpinning] = useState<boolean>(false);
  const [canSpin, setCanSpin] = useState<boolean>(true);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(1000);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const spinCost = 100;

  const spinWheel = () => {
    if (spinning) return;
    
    // Check if user has enough balance
    if (walletBalance < spinCost) {
      toast.error('Insufficient balance. Please deposit to continue.');
      return;
    }
    
    // Deduct spin cost
    setWalletBalance(walletBalance - spinCost);
    
    setSpinning(true);
    setCanSpin(false);
    setSpinResult(null);
    
    // Determine the outcome (only "Better luck next time" or "₹5" are possible)
    const possibleOutcomes = [
      { prize: '₹5', probability: 0.2 },
      { prize: 'Better luck next time', probability: 0.8 }
    ];
    
    // Random selection based on probability
    const rand = Math.random();
    const outcome = rand <= possibleOutcomes[0].probability ? possibleOutcomes[0].prize : possibleOutcomes[1].prize;
    
    // Find the index of the outcome in the wheel
    const outcomeIndex = wheelSections.findIndex(section => section.prize === outcome);
    
    // Calculate rotation: 
    // 5 full rotations plus position to land on the outcome section
    const sectionAngle = 360 / wheelSections.length;
    const destinationAngle = 360 - (outcomeIndex * sectionAngle); // Wheel rotates clockwise
    const spinAngle = 1800 + destinationAngle; // 5 full rotations (1800 degrees) plus destination angle
    
    const newRotation = wheelRotation + spinAngle;
    setWheelRotation(newRotation);
    
    // After spinning completes
    setTimeout(() => {
      setSpinning(false);
      setSpinResult(outcome);
      
      // If won 5 rupees, add to wallet
      if (outcome === '₹5') {
        setWalletBalance(prevBalance => prevBalance + 5);
        toast.success('You won ₹5!');
      } else {
        toast.info('Better luck next time!');
      }
      
      setTimeout(() => {
        setCanSpin(true);
      }, 1000);
    }, 5000);
  };

  const renderWheel = () => {
    return wheelSections.map((section, index) => {
      const angle = (360 / wheelSections.length) * index;
      return (
        <div
          key={index}
          className="wheel-section"
          style={{
            transform: `rotate(${angle}deg)`,
            backgroundColor: section.color,
          }}
        >
          <div 
            className="text-white font-bold text-xs text-center w-full"
            style={{
              transform: `rotate(${90 + angle}deg)`,
              transformOrigin: 'bottom',
              position: 'absolute',
              bottom: '40%',
              width: '120px',
              left: '-30px',
            }}
          >
            {section.prize}
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
        
        <div className="bg-white rounded-lg p-4 shadow-md mb-4">
          <div className="wheel-container">
            <div 
              ref={wheelRef}
              className="wheel"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transitionProperty: spinning ? 'transform' : 'none',
              }}
            >
              {renderWheel()}
            </div>
            <div className="wheel-arrow"></div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="mb-2">Spin Cost: ₹{spinCost}</p>
          <Button 
            onClick={spinWheel} 
            disabled={spinning || !canSpin}
            className="bg-game-primary hover:bg-game-primary/80 px-8"
          >
            {spinning ? 'Spinning...' : 'Spin'}
          </Button>
        </div>
        
        {spinResult && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold">Result</h2>
            <div className="bg-white p-4 rounded-lg shadow-md mt-2">
              <p className="text-lg">{spinResult}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelSpin;
