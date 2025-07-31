
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ArrowRight, Heart, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { getFeaturedProducts, type ProductData } from '@/data/products';

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
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          is_featured,
          is_new,
          stock_quantity,
          categories (name)
        `)
        .eq('is_featured', true)
        .limit(6);

      if (error) throw error;

      // Update products with proper images
      const productsWithImages = (data || []).map((product, index) => {
        const imageKeys = Object.keys(productImageMap);
        const imageKey = imageKeys[index % imageKeys.length];
        return {
          ...product,
          image_url: productImageMap[imageKey] || product.image_url
        };
      });

      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error loading featured products:', error);
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

  const handleQuickBuy = (product: Product) => {
    const message = `Hi! I'm interested in purchasing ${product.name} (₹${product.price}). Can you help me with the order?`;
    const whatsappUrl = `https://wa.me/918506912255?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

        {/* Products Horizontal Scroll */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden hover:from-purple-900/20 hover:to-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-800/20 animate-fade-in relative"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    minWidth: '320px',
                    width: '320px'
                  }}
                >
                  {/* Image Container */}
                  <Link to={`/product/${product.id}`}>
                     <div className="relative aspect-square overflow-hidden">
                       <img
                         src={product.image_url}
                         alt={product.name}
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                         onError={(e) => {
                           (e.target as HTMLImageElement).src = '/lovable-uploads/LOGO.png';
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

                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                     {/* Category */}
                     <span className="text-purple-400 text-sm font-bold tracking-wider uppercase">
                       {product.categories?.name || 'Product'}
                     </span>
                    
                    {/* Title */}
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-white text-xl font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
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
                    <p className="text-gray-400 line-clamp-2 leading-relaxed text-sm">
                      {product.description}
                    </p>

                    {/* Price and Actions */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-purple-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xl font-bold">
                          ₹{product.price.toFixed(0)}
                        </span>
                        <span className="text-green-400 text-sm">Free Shipping</span>
                      </div>
                       
                       <div className="flex gap-2">
                         <Button
                           size="sm"
                           onClick={() => handleQuickAdd(product)}
                           className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-bold flex-1"
                         >
                           <ShoppingCart className="h-3 w-3 mr-1" />
                           ADD
                         </Button>
                         <Button
                           size="sm"
                           onClick={() => handleQuickBuy(product)}
                           variant="outline"
                           className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 font-bold flex-1"
                         >
                           <MessageCircle className="h-3 w-3 mr-1" />
                           BUY
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
          </div>
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
