
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category_id?: string;
  price: number;
  originalPrice?: number;
  image_url: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  description?: string;
  is_featured?: boolean;
  is_new?: boolean;
  categories?: {
    name: string;
  };
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

const ProductCarousel = ({ title, products }: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleQuickAdd = async (productId: string, productName: string) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart')
          .insert([
            {
              user_id: user.id,
              product_id: productId,
              quantity: 1
            }
          ]);

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${productName} has been added to your cart.`
      });

      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive"
      });
    }
  };

  const handleExploreClick = (categoryName: string) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {title}
          </h2>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="bg-white/5 border-white/10 text-white hover:bg-purple-600 hover:border-purple-600 rounded-none h-12 w-12 transition-all duration-300"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="bg-white/5 border-white/10 text-white hover:bg-purple-600 hover:border-purple-600 rounded-none h-12 w-12 transition-all duration-300"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-80 group cursor-pointer"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden bg-gray-900 mb-6 transform transition-all duration-500 hover:scale-105">
                  {(product.is_new || product.is_featured) && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-purple-600 text-white px-3 py-1 text-xs font-bold tracking-wider">
                        {product.is_new ? 'NEW' : 'FEATURED'}
                      </span>
                    </div>
                  )}
                  
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickAdd(product.id, product.name);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-none font-bold transform hover:scale-105 transition-all duration-300"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      QUICK ADD
                    </Button>
                  </div>

                  {/* Explore Button */}
                  {product.categories && (
                    <div className="absolute bottom-4 left-4 z-10">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleExploreClick(product.categories!.name);
                        }}
                        size="sm"
                        className="bg-purple-600/80 hover:bg-purple-700 text-white px-4 py-2 text-xs font-bold"
                      >
                        EXPLORE {product.categories.name.toUpperCase()}
                      </Button>
                    </div>
                  )}
                </div>
              </Link>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">(247)</span>
                </div>
                
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-white text-xl font-bold group-hover:text-purple-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-400 text-sm uppercase tracking-wider">
                  {product.categories?.name || 'Supplement'}
                </p>
                
                <div className="flex items-center gap-3">
                  <span className="text-white text-2xl font-bold">
                    ₹{product.price.toFixed(0)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-500 text-lg line-through">
                      ₹{product.originalPrice.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
