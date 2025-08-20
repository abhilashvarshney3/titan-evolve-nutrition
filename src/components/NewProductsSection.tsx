import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts, ProductWithVariantsAndImages } from '@/hooks/useProducts';
import ModernProductCard from '@/components/ModernProductCard';

const NewProductsSection = () => {
  const { products, loading } = useProducts();
  const newProducts = products.filter(product => product.is_new);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showNavigation, setShowNavigation] = useState(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowNavigation(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [newProducts]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading new products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (newProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-purple-400 mr-3" />
            <h2 className="text-5xl font-black text-white">
              NEW <span className="text-purple-400">ARRIVALS</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our most advanced supplements, freshly engineered for hardcore results
          </p>
        </div>

        <div className="relative group">
          {/* Desktop Navigation Arrows - Only show if scrollable */}
          {showNavigation && (
            <div className="hidden md:flex">
              <Button
                onClick={scrollLeft}
                variant="outline"
                size="icon"
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-black/80 border-purple-500 hover:bg-purple-600 hover:border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </Button>
              <Button
                onClick={scrollRight}
                variant="outline"
                size="icon"
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-black/80 border-purple-500 hover:bg-purple-600 hover:border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </Button>
            </div>
          )}

          {/* Products Grid */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {newProducts.map((product: ProductWithVariantsAndImages) => (
              <div key={product.id} className="flex-shrink-0 w-64 sm:w-72 md:w-80">
                <ModernProductCard
                  product={product}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <Link to="/shop?filter=new">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-bold group"
            >
              VIEW ALL NEW PRODUCTS
              <Zap className="ml-2 h-5 w-5 group-hover:animate-pulse" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewProductsSection;