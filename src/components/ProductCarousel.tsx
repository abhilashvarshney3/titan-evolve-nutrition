
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';

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

// Product images mapping
const productImageMap: { [key: string]: string } = {
  'whey-protein': '/lovable-uploads/07c966c6-c74a-41cd-bdf1-b37a79c15e05.png',
  'creatine': '/lovable-uploads/379dfbc4-577f-4c70-8379-887938232ec0.png',
  'pre-workout': '/lovable-uploads/534d4161-7ade-4f7c-bfe9-debf0e569cc5.png',
  'bcaa': '/lovable-uploads/729e363e-5733-4ed4-a128-36142849c19e.png',
  'mass-gainer': '/lovable-uploads/746318e4-45e9-471f-a51f-473b614f8266.png',
  'protein-bar': '/lovable-uploads/ab7a6da8-9536-4097-8873-2667208ceef8.png',
  'glutamine': '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png',
  'fish-oil': '/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png'
};

const ProductCarousel = ({ title, products }: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

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

  // Update products with new images and minimum pricing
  const updatedProducts = products.map((product, index) => {
    const imageKeys = Object.keys(productImageMap);
    const imageKey = imageKeys[index % imageKeys.length];
    return {
      ...product,
      image_url: productImageMap[imageKey] || product.image_url,
      price: Math.max(product.price, 4500 + (index * 500))
    };
  });

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
          {updatedProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none w-80 group cursor-pointer"
            >
              <div className="relative overflow-hidden bg-gray-900 mb-6 transform transition-all duration-500 hover:scale-105">
                {(product.is_new || product.is_featured) && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-purple-600 text-white px-3 py-1 text-xs font-bold tracking-wider">
                      {product.is_new ? 'NEW' : 'FEATURED'}
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id, product.name);
                  }}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                    isInWishlist(product.id)
                      ? 'bg-red-600 text-white'
                      : 'bg-black/50 text-white hover:bg-red-600/80'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
                
                <Link to={`/product/${product.id}`} className="block">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>
                
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
