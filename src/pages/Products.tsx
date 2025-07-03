
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Products = () => {
  const categories = [
    {
      id: 'pre-workout',
      name: 'PRE-WORKOUT',
      description: 'Explosive energy and focus for maximum performance',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
      productCount: 12
    },
    {
      id: 'protein',
      name: 'PROTEIN',
      description: 'Premium whey and casein for muscle building',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=2070&auto=format&fit=crop',
      productCount: 18
    },
    {
      id: 'mass-gainer',
      name: 'MASS GAINER',
      description: 'High-calorie formulas for serious size gains',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop',
      productCount: 8
    },
    {
      id: 'fat-loss',
      name: 'FAT LOSS',
      description: 'Thermogenic compounds for cutting cycles',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
      productCount: 15
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-black flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-7xl font-black tracking-tight mb-4">PRODUCTS</h1>
          <p className="text-2xl text-gray-300 max-w-2xl">
            Scientifically formulated supplements engineered for elite performance
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative h-96 overflow-hidden cursor-pointer"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-red-400 text-sm font-bold tracking-wider">
                      {category.productCount} PRODUCTS
                    </span>
                    <h3 className="text-4xl font-black mb-2">{category.name}</h3>
                    <p className="text-gray-300 mb-6">{category.description}</p>
                    
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-none font-bold">
                      EXPLORE
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
