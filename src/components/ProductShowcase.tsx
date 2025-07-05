
import React, { useEffect, useRef, useState } from 'react';
import ProductCarousel from './ProductCarousel';

const ProductShowcase = () => {
  const [featuredVisible, setFeaturedVisible] = useState(false);
  const [newArrivalsVisible, setNewArrivalsVisible] = useState(false);
  const featuredRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === featuredRef.current && entry.isIntersecting) {
            setFeaturedVisible(true);
          }
          if (entry.target === newArrivalsRef.current && entry.isIntersecting) {
            setNewArrivalsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuredRef.current) observer.observe(featuredRef.current);
    if (newArrivalsRef.current) observer.observe(newArrivalsRef.current);

    return () => observer.disconnect();
  }, []);

  const featuredProducts = [
    {
      id: '1',
      name: 'MURDERER Pre-Workout',
      category: 'Pre-Workout',
      price: 49.99,
      originalPrice: 59.99,
      image: '/lovable-uploads/07c966c6-c74a-41cd-bdf1-b37a79c15e05.png',
      rating: 4.9,
      reviewCount: 342,
      badge: 'BESTSELLER',
      description: 'Hard hitting pre-workout with hardcore pump and laser focus'
    },
    {
      id: '2',
      name: 'LEAN WHEY Protein',
      category: 'Protein',
      price: 39.99,
      originalPrice: 44.99,
      image: '/lovable-uploads/ab7a6da8-9536-4097-8873-2667208ceef8.png',
      rating: 4.8,
      reviewCount: 456,
      description: 'Ultra micro filtered whey with 24g protein and fast absorption'
    },
    {
      id: '3',
      name: 'LEAN WHEY Premium',
      category: 'Protein',
      price: 44.99,
      image: '/lovable-uploads/746318e4-45e9-471f-a51f-473b614f8266.png',
      rating: 4.7,
      reviewCount: 289,
      badge: 'NEW',
      description: 'Premium whey protein for lean muscle development'
    },
    {
      id: '4',
      name: 'LEAN WHEY Elite',
      category: 'Protein',
      price: 49.99,
      image: '/lovable-uploads/729e363e-5733-4ed4-a128-36142849c19e.png',
      rating: 4.6,
      reviewCount: 198,
      description: 'Elite formula for maximum muscle recovery'
    }
  ];

  const newProducts = [
    {
      id: '5',
      name: 'MURDERER Intense',
      category: 'Pre-Workout',
      price: 54.99,
      image: '/lovable-uploads/07c966c6-c74a-41cd-bdf1-b37a79c15e05.png',
      rating: 4.8,
      reviewCount: 89,
      badge: 'NEW',
      description: 'Intense pre-workout formula for hardcore training'
    },
    {
      id: '6',
      name: 'LEAN WHEY Advanced',
      category: 'Protein',
      price: 42.99,
      image: '/lovable-uploads/ab7a6da8-9536-4097-8873-2667208ceef8.png',
      rating: 4.6,
      reviewCount: 234,
      description: 'Advanced whey formula with enhanced absorption'
    }
  ];

  return (
    <div className="bg-black">
      <div 
        ref={featuredRef}
        className={`transform transition-all duration-1000 ${
          featuredVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <ProductCarousel title="FEATURED" products={featuredProducts} />
      </div>
      
      <div 
        ref={newArrivalsRef}
        className={`transform transition-all duration-1000 delay-300 ${
          newArrivalsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <ProductCarousel title="NEW ARRIVALS" products={newProducts} />
      </div>
    </div>
  );
};

export default ProductShowcase;
