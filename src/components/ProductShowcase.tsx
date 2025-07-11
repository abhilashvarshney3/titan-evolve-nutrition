
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ArrowRight, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  categories?: {
    name: string;
  };
}

// Updated product images mapping with your new uploaded images
const productImageMap: { [key: string]: string } = {
  'whey-protein': '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png',
  'lean-whey-1': '/lovable-uploads/6f21609e-a5cd-4cc0-a41a-82da539f5d0f.png',
  'lean-whey-2': '/lovable-uploads/cc7b982a-2963-4aa1-a018-5a61326ddf2c.png',
  'lean-whey-3': '/lovable-uploads/4fee9b66-0c62-4d8c-b54d-72d7f96438ee.png',
  'lean-whey-4': '/lovable-uploads/eb51c9b0-6315-4286-917c-7cb77f40819b.png',
  'lean-whey-5': '/lovable-uploads/01639641-f34b-4a7f-b28d-02d91875dc2c.png',
  'lean-whey-6': '/lovable-uploads/81d96adc-b283-4208-990d-1f54b9bda60f.png',
  'lean-whey-7': '/lovable-uploads/1e473ded-53cc-4557-ac29-e3a9e518d662.png',
  'murderer-pre-1': '/lovable-uploads/ff150af1-45f4-466a-a0f0-8c24b6de0207.png',
  'murderer-pre-2': '/lovable-uploads/3e9a2628-505c-4ff1-87e4-bf4481e661c9.png'
};

const ProductShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      // Update products with your uploaded images and adjusted pricing
      const updatedProducts = (data || []).map((product, index) => {
        const imageKeys = Object.keys(productImageMap);
        const imageKey = imageKeys[index % imageKeys.length];
        return {
          ...product,
          image_url: productImageMap[imageKey] || product.image_url,
          // Ensure minimum price of ₹4500
          price: Math.max(product.price, 4500 + (index * 500))
        };
      });

      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error in fetchFeaturedProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (product: Product) => {
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
        .eq('product_id', product.id)
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

  const handleInstantCheckout = async (product: Product) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in for instant checkout.",
        variant: "destructive"
      });
      return;
    }

    // Add to cart first
    await handleQuickAdd(product);
    
    // Redirect to cart for checkout
    window.location.href = '/cart';
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

  if (products.length === 0) {
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
          <h2 className="text-5xl font-black text-white mb-4">
            FEATURED <span className="text-purple-400">PRODUCTS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our most popular supplements, trusted by athletes and fitness enthusiasts worldwide
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden hover:from-purple-900/20 hover:to-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-800/20 animate-fade-in relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.is_new && (
                      <Badge className="bg-purple-600 text-white px-3 py-1 text-sm font-bold">
                        NEW
                      </Badge>
                    )}
                    {product.is_featured && (
                      <Badge className="bg-yellow-600 text-black px-3 py-1 text-sm font-bold">
                        FEATURED
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
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

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuickAdd(product);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 transform hover:scale-105 transition-all duration-300"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        QUICK ADD
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleInstantCheckout(product);
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-3 transform hover:scale-105 transition-all duration-300"
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        BUY NOW
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-8 space-y-4">
                {/* Category */}
                <span className="text-purple-400 text-sm font-bold tracking-wider uppercase">
                  {product.categories?.name || 'Supplement'}
                </span>
                
                {/* Title */}
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-white text-2xl font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
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
                  <span className="text-gray-400 text-sm">(247 reviews)</span>
                </div>

                {/* Description */}
                <p className="text-gray-400 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-800/30">
                  <div className="flex flex-col">
                    <span className="text-white text-2xl font-bold">
                      ₹{product.price.toFixed(0)}
                    </span>
                    <span className="text-green-400 text-sm">Free Shipping</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleQuickAdd(product)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-bold"
                    >
                      ADD TO CART
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleInstantCheckout(product)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 font-bold text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      BUY NOW
                    </Button>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="text-sm">
                  {product.stock_quantity > 0 ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      In Stock ({product.stock_quantity} available)
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More Button */}
        <div className="text-center animate-fade-in">
          <Link to="/shop">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-lg font-bold group"
            >
              EXPLORE ALL PRODUCTS
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
