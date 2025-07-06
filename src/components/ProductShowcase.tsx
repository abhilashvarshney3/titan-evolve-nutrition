
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

// Updated product images mapping with your uploaded images
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

const ProductShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

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

      // Update products with your uploaded images
      const updatedProducts = (data || []).map((product, index) => {
        const imageKeys = Object.keys(productImageMap);
        const imageKey = imageKeys[index % imageKeys.length];
        return {
          ...product,
          image_url: productImageMap[imageKey] || product.image_url
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
                  <button className="absolute top-4 right-4 p-3 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-600 hover:scale-110">
                    <Heart className="h-5 w-5 text-white" />
                  </button>

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      onClick={() => handleQuickAdd(product)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 transform hover:scale-105 transition-all duration-300"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      QUICK ADD
                    </Button>
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
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleQuickAdd(product)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-bold"
                    >
                      ADD TO CART
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
