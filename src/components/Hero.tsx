
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Trophy } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Cpath d=\"m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16 lg:py-24 xl:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm font-semibold rounded-full border border-purple-500/30">
                  PREMIUM NUTRITION
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                MURDER YOUR
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                  LIMITS
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                Unleash your potential with scientifically formulated supplements designed for elite athletes and serious fitness enthusiasts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold group transition-all duration-200 hover:scale-105">
                  Shop Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
                  Learn More
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">High Performance</div>
                    <div className="text-sm text-gray-400">Premium Formula</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Lab Tested</div>
                    <div className="text-sm text-gray-400">Quality Assured</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <Trophy className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Pro Grade</div>
                    <div className="text-sm text-gray-400">Elite Results</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
                  <img
                    src="/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png"
                    alt="Murderer Pre-Workout"
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-white">3200mg</div>
                <div className="text-sm text-gray-300">Beta Alanine</div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-purple-600/90 backdrop-blur-sm p-4 rounded-xl border border-purple-500/30">
                <div className="text-2xl font-bold text-white">200mg</div>
                <div className="text-sm text-purple-200">Caffeine</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
