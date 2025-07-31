
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Zap, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { getNewProducts, type ProductData } from '@/data/products';
import { useRef } from 'react';

const NewProductsSection = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    loadNewProducts();
  }, []);

  const loadNewProducts = () => {
    try {
      const newProducts = getNewProducts();
      setProducts(newProducts);
    } catch (error) {
      console.error('Error loading new products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (product: ProductData) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (existingItem) {
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart')
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
              quantity: 1
            }
          ]);

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`
      });

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

  const handleQuickBuy = (product: ProductData) => {
    const message = `Hi! I'm interested in purchasing ${product.name} (₹${product.price}). Can you help me with the order?`;
    const whatsappUrl = `https://wa.me/919650602521?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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

  if (loading || products.length === 0) {
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
            Discover our latest cutting-edge supplements, fresh from the lab
          </p>
        </div>

        <div className="relative">
          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex">
            <Button
              onClick={scrollLeft}
              variant="outline"
              size="icon"
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-black/80 border-purple-500 hover:bg-purple-600 hover:border-purple-400"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </Button>
            <Button
              onClick={scrollRight}
              variant="outline"
              size="icon"
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-black/80 border-purple-500 hover:bg-purple-600 hover:border-purple-400"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </Button>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide" ref={scrollContainerRef}>
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden hover:from-purple-900/30 hover:to-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-800/20 animate-fade-in relative"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    minWidth: '320px',
                    width: '320px'
                  }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden">
                       <img
                         src={product.image}
                         alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 text-sm font-bold animate-pulse">
                          NEW
                        </Badge>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product.id, product.name);
                        }}
                        className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                          isInWishlist(product.id)
                            ? 'bg-red-600 text-white'
                            : 'bg-black/50 text-white hover:bg-purple-600'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>

                    </div>
                  </Link>

                  <div className="p-6 space-y-4">
                     <span className="text-purple-400 text-sm font-bold tracking-wider uppercase">
                       {product.category}
                    </span>
                    
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-white text-xl font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-3">
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
                      <span className="text-gray-400 text-sm">(New!)</span>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <span className="text-white text-2xl font-bold">
                        ₹{product.price.toFixed(0)}
                      </span>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleQuickAdd(product)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-bold flex-1"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          ADD
                        </Button>
                        <Button
                          onClick={() => handleQuickBuy(product)}
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 font-bold flex-1"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          BUY
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
