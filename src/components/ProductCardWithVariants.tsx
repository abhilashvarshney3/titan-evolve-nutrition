import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartQuantityWithVariants } from '@/hooks/useCartQuantityWithVariants';
import { useProductReviews } from '@/hooks/useProductReviews';
import ReviewStars from '@/components/ReviewStars';
import VariantSelector from '@/components/VariantSelector';
import { ProductWithVariantsAndImages, DatabaseProductVariant } from '@/hooks/useProducts';
import VariantImageSlider from './VariantImageSlider';

interface ProductCardWithVariantsProps {
  product: ProductWithVariantsAndImages;
  showVariantSelector?: boolean;
}

const ProductCardWithVariants: React.FC<ProductCardWithVariantsProps> = ({ 
  product,
  showVariantSelector = true 
}) => {
  // Add debugging
  console.log('ProductCardWithVariants received product:', product);
  
  // Add safety checks for product and variants
  if (!product) {
    console.warn('ProductCardWithVariants: product is undefined');
    return null;
  }
  
  if (!product.variants || product.variants.length === 0) {
    console.warn('ProductCardWithVariants: product has no variants:', product);
    return null;
  }

  console.log('ProductCardWithVariants: product variants:', product.variants);

  const [selectedVariant, setSelectedVariant] = useState<DatabaseProductVariant>(
    product.variants[0]
  );
  const [showVariants, setShowVariants] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getQuantity, updateQuantity } = useCartQuantityWithVariants();
  const { stats: reviewStats } = useProductReviews(product.id);

  const currentQuantity = selectedVariant ? getQuantity(product.id, selectedVariant.id) : 0;

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVariant) {
      toast({
        title: "Error",
        description: "Please select a product variant.",
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
        .eq('variant_id', selectedVariant.id)
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
              variant_id: selectedVariant.id,
              quantity: 1
            }
          ]);

        if (error) throw error;
      }

      updateQuantity(product.id, selectedVariant.id, currentQuantity + 1);
      toast({
        title: "Added to Cart",
        description: `${selectedVariant.variant_name} added to your cart.`
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

  const handleIncrementQuantity = async () => {
    if (!user || !selectedVariant) return;

    try {
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('variant_id', selectedVariant.id)
        .maybeSingle();

      if (existingItem) {
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
        updateQuantity(product.id, selectedVariant.id, currentQuantity + 1);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDecrementQuantity = async () => {
    if (!user || !selectedVariant || currentQuantity <= 0) return;

    try {
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('variant_id', selectedVariant.id)
        .maybeSingle();

      if (existingItem) {
        if (existingItem.quantity <= 1) {
          const { error } = await supabase
            .from('cart')
            .delete()
            .eq('id', existingItem.id);

          if (error) throw error;
          updateQuantity(product.id, selectedVariant.id, 0);
        } else {
          const { error } = await supabase
            .from('cart')
            .update({ quantity: existingItem.quantity - 1 })
            .eq('id', existingItem.id);

          if (error) throw error;
          updateQuantity(product.id, selectedVariant.id, currentQuantity - 1);
        }
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleQuickBuy = () => {
    if (!selectedVariant) return;
    
    const message = `Hi! I want to buy ${selectedVariant.variant_name} - ${product.name} for ₹${selectedVariant.price}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="group bg-gray-900 border-purple-800/30 hover:border-purple-600 transition-all duration-300 hover:scale-105 relative overflow-hidden">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-800 group">
          <Link to={`/product/${product.id}`}>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-4 hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <img
                src="/placeholder.svg"
                alt={product.name}
                className="w-full h-full object-contain p-4 hover:scale-110 transition-transform duration-500"
              />
            )}
          </Link>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && (
              <Badge className="bg-purple-600 text-white text-xs px-2 py-1">NEW</Badge>
            )}
            {product.is_featured && (
              <Badge className="bg-yellow-600 text-black text-xs px-2 py-1">FEATURED</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button 
            onClick={() => toggleWishlist(product.id, product.name)}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isInWishlist(product.id)
                ? 'bg-red-600 text-white'
                : 'bg-black/50 text-white hover:bg-purple-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-white font-bold text-lg hover:text-purple-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-purple-400 text-sm uppercase tracking-wider">Product</p>

          {/* Reviews */}
          {reviewStats && reviewStats.total_reviews > 0 ? (
            <ReviewStars 
              rating={reviewStats.average_rating} 
              totalReviews={reviewStats.total_reviews} 
              showText={true}
              size="sm"
            />
          ) : (
            <span className="text-gray-400 text-xs">No reviews yet</span>
          )}

          <p className="text-gray-300 text-sm line-clamp-2">{product.description}</p>

          {/* Variant Selector */}
          {showVariantSelector && product.variants.length > 1 && (
            <div className="space-y-2">
              <button
                onClick={() => setShowVariants(!showVariants)}
                className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
              >
                {showVariants ? 'Hide Options' : 'Show Options'}
              </button>
              
              {showVariants && (
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                  className="text-xs"
                />
              )}
            </div>
          )}

          {/* Selected Variant Info */}
          <div className="space-y-1">
            {selectedVariant && (
              <>
                <p className="text-purple-300 text-sm font-medium">{selectedVariant.variant_name}</p>
                <p className="text-white text-xl font-bold">₹{selectedVariant.price.toFixed(0)}</p>
                {selectedVariant.stock_quantity <= 10 && selectedVariant.stock_quantity > 0 && (
                  <p className="text-orange-400 text-xs">Only {selectedVariant.stock_quantity} left!</p>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {currentQuantity > 0 ? (
              <div className="flex items-center bg-purple-600 rounded-lg flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecrementQuantity}
                  className="text-white hover:bg-purple-700 px-2"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-white font-bold px-3">{currentQuantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleIncrementQuantity}
                  className="text-white hover:bg-purple-700 px-2"
                  disabled={!selectedVariant || currentQuantity >= selectedVariant.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 disabled:opacity-50"
              >
                <ShoppingCart className="mr-1 h-3 w-3" />
                ADD TO CART
              </Button>
            )}
            
            <Button
              onClick={handleQuickBuy}
              disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 text-xs disabled:opacity-50"
            >
              BUY
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardWithVariants;