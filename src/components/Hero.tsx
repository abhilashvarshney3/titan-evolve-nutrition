
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=2074&auto=format&fit=crop"
          alt="Fitness athlete"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>
      </div>

      {/* Centered content */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-semibold tracking-wider">
            PREMIUM NUTRITION
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black leading-none mb-8 tracking-tight">
          MURDER YOUR
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            LIMITS
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Scientifically engineered supplements for elite performance. 
          Unleash your true potential.
        </p>

        <div className="flex justify-center">
          <Link to="/shop">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-16 py-6 text-lg font-bold rounded-none transition-all duration-300 hover:scale-105 border-2 border-red-600 hover:border-red-500">
              SHOP NOW
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
