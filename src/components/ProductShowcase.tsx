
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
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
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

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched products:', products);

      if (products) {
        const featured = products.filter(product => product.is_featured);
        const newArrivals = products.filter(product => product.is_new);
        
        setFeaturedProducts(featured);
        setNewProducts(newArrivals);
        
        console.log('Featured products:', featured);
        console.log('New products:', newArrivals);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
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

  if (error) {
    return (
      <div className="bg-black py-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black">
      {featuredProducts.length > 0 && (
        <div 
          ref={featuredRef}
          className={`transform transition-all duration-1000 ${
            featuredVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <ProductCarousel title="FEATURED" products={featuredProducts} />
        </div>
      )}
      
      {newProducts.length > 0 && (
        <div 
          ref={newArrivalsRef}
          className={`transform transition-all duration-1000 delay-300 ${
            newArrivalsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <ProductCarousel title="NEW ARRIVALS" products={newProducts} />
        </div>
      )}

      {featuredProducts.length === 0 && newProducts.length === 0 && (
        <div className="bg-black py-20">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400">No products available at the moment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductShowcase;
