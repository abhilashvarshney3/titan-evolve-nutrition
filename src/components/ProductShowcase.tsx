
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCarousel from './ProductCarousel';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  stock_quantity: number;
  sku: string;
  is_featured: boolean;
  is_new: boolean;
  categories?: {
    name: string;
  };
}

const ProductShowcase = () => {
  const [featuredVisible, setFeaturedVisible] = useState(false);
  const [newArrivalsVisible, setNewArrivalsVisible] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          category_id,
          stock_quantity,
          sku,
          is_featured,
          is_new,
          categories (
            name
          )
        `);

      if (error) throw error;

      if (products) {
        const featured = products.filter(product => product.is_featured);
        const newArrivals = products.filter(product => product.is_new);
        
        setFeaturedProducts(featured);
        setNewProducts(newArrivals);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

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
