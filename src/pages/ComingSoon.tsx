
import React from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-game-primary/10 flex items-center justify-center">
            <span className="text-4xl">🚧</span>
          </div>
          <h1 className="text-2xl font-bold text-game-primary mb-4">Coming Soon!</h1>
          <p className="text-gray-600 mb-6">
            We're working hard to bring this game to you. Please check back soon!
          </p>
          <div className="flex justify-center">
            <Button asChild className="bg-game-primary hover:bg-game-primary/90">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
