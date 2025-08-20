import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts, ProductWithVariantsAndImages } from '@/hooks/useProducts';
import ProductCardWithVariants from '@/components/ProductCardWithVariants';

const ProductShowcase = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.filter(product => product.is_featured);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-4">FEATURED PRODUCTS</h2>
            <p className="text-gray-400">No featured products available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            FEATURED <span className="text-purple-400">PRODUCTS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our top-rated supplements trusted by athletes worldwide
          </p>
        </div>

        {/* Products Horizontal Scroll */}
        <div className="relative group">
          {/* Desktop Navigation Arrows */}
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
          
          {/* Products Grid */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product: ProductWithVariantsAndImages) => (
              <div key={product.id} className="flex-shrink-0 w-64 sm:w-72 md:w-80">
                <ProductCardWithVariants
                  product={product}
                  showVariantSelector={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;