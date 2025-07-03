
import React from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ProductShowcase = () => {
  const featuredProducts = [
    {
      id: '1',
      name: 'MURDERER Pre-Workout',
      category: 'Pre-Workout',
      price: 49.99,
      originalPrice: 59.99,
      image: '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png',
      rating: 4.9,
      reviewCount: 342,
      badge: 'BESTSELLER',
      description: 'Hard-hitting pre-workout formula with 200mg caffeine, 3200mg beta-alanine for explosive energy and focus.'
    },
    {
      id: '2',
      name: 'MUSCLE GAINER Premium',
      category: 'Mass Gainer',
      price: 64.99,
      image: '/lovable-uploads/534d4161-7ade-4f7c-bfe9-debf0e569cc5.png',
      rating: 4.7,
      reviewCount: 198,
      badge: 'NEW',
      description: 'Advanced formula for muscle gaining with 20g protein, 64g carbs, and 480 calories per serving.'
    },
    {
      id: '3',
      name: 'LEAN WHEY Protein',
      category: 'Protein',
      price: 39.99,
      originalPrice: 44.99,
      image: '/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png',
      rating: 4.8,
      reviewCount: 456,
      description: 'Ultra micro-filtered whey protein with 24g protein, 11.4g EAAs for lean muscle development.'
    },
    {
      id: '4',
      name: 'CREATINE Monohydrate',
      category: 'Creatine',
      price: 29.99,
      image: '/lovable-uploads/379dfbc4-577f-4c70-8379-887938232ec0.png',
      rating: 4.6,
      reviewCount: 289,
      description: '500mg ultra-micronized pure creatine monohydrate for enhanced strength and muscle growth.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-6">
            <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
            PREMIUM SUPPLEMENTS
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our scientifically formulated supplements designed to help you achieve peak performance and crush your fitness goals.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg group">
            View All Products
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
