import React, { useEffect, useState } from "react";

interface GameBannerProps {
  images: string[];
}

const GameBanner: React.FC<GameBannerProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden rounded-xl mb-4" style={{ height: 180,marginTop: 9 }}>
      <img
        src={images[current]}
        alt={`Banner ${current + 1}`}
        className="object-cover w-full h-full transition-all duration-700"
        style={{ maxHeight: 180 }}
      />
    </div>
  );
};

export default GameBanner;