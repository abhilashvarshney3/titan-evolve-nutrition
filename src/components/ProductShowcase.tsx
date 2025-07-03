
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
      image: '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png',
      rating: 4.9,
      reviewCount: 342,
      badge: 'BESTSELLER'
    },
    {
      id: '2',
      name: 'MUSCLE GAINER Premium',
      category: 'Mass Gainer',
      price: 64.99,
      image: '/lovable-uploads/534d4161-7ade-4f7c-bfe9-debf0e569cc5.png',
      rating: 4.7,
      reviewCount: 198,
      badge: 'NEW'
    },
    {
      id: '3',
      name: 'LEAN WHEY Protein',
      category: 'Protein',
      price: 39.99,
      originalPrice: 44.99,
      image: '/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png',
      rating: 4.8,
      reviewCount: 456
    },
    {
      id: '4',
      name: 'CREATINE Monohydrate',
      category: 'Creatine',
      price: 29.99,
      image: '/lovable-uploads/379dfbc4-577f-4c70-8379-887938232ec0.png',
      rating: 4.6,
      reviewCount: 289
    },
    {
      id: '5',
      name: 'BCAA Recovery',
      category: 'Recovery',
      price: 34.99,
      image: '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png',
      rating: 4.5,
      reviewCount: 156
    }
  ];

  const newProducts = [
    {
      id: '6',
      name: 'PUMP Enhancer',
      category: 'Pre-Workout',
      price: 44.99,
      image: '/lovable-uploads/534d4161-7ade-4f7c-bfe9-debf0e569cc5.png',
      rating: 4.8,
      reviewCount: 89,
      badge: 'NEW'
    },
    {
      id: '7',
      name: 'FAT BURNER Elite',
      category: 'Fat Loss',
      price: 54.99,
      image: '/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png',
      rating: 4.6,
      reviewCount: 234
    },
    {
      id: '8',
      name: 'SLEEP Formula',
      category: 'Recovery',
      price: 39.99,
      image: '/lovable-uploads/379dfbc4-577f-4c70-8379-887938232ec0.png',
      rating: 4.7,
      reviewCount: 112
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
