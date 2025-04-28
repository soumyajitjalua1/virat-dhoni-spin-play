
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface GameBannerProps {
  images: string[];
}

const GameBanner = ({ images }: GameBannerProps) => {
  return (
    <div className="w-full py-2 px-1">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img 
                  src={image} 
                  alt={`Banner ${index + 1}`} 
                  className="rounded-lg w-full h-40 object-cover" 
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default GameBanner;
