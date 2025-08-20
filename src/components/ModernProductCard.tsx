import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, MessageCircle, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartQuantityWithVariants } from '@/hooks/useCartQuantityWithVariants';
import { useProductReviews } from '@/hooks/useProductReviews';
import { ProductWithVariantsAndImages, DatabaseProductVariant } from '@/hooks/useProducts';
import ReviewStars from '@/components/ReviewStars';
import { supabase } from '@/integrations/supabase/client';

interface ModernProductCardProps {
  product: ProductWithVariantsAndImages;
}

const ModernProductCard = ({ product }: ModernProductCardProps) => {
  const [selectedVariant, setSelectedVariant] = useState<DatabaseProductVariant>(
    product.variants[0] || {
      id: product.id,
      product_id: product.id,
      variant_name: product.name,
      flavor: null,
      size: 'Default',
      price: product.price,
      original_price: null,
      stock_quantity: product.stock_quantity,
      sku: product.sku,
      is_active: true
    }
  );

  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getQuantity, updateQuantity, loading } = useCartQuantityWithVariants();
  
  const quantity = getQuantity(product.id, selectedVariant.id);
  
  const incrementQuantity = () => {
    updateQuantity(product.id, selectedVariant.id, quantity + 1);
  };
  
  const decrementQuantity = () => {
    updateQuantity(product.id, selectedVariant.id, Math.max(0, quantity - 1));
  };
  const { stats: reviewStats } = useProductReviews(product.id);

  // Get variant image or fallback to product image
  const getVariantImage = () => {
    const variant = product.variants.find(v => v.id === selectedVariant.id);
    const variantImages = variant?.images;
    if (variantImages && variantImages.length > 0) {
      const primaryImage = variantImages.find(img => img.is_primary);
      return primaryImage?.image_url || variantImages[0]?.image_url;
    }
    return product.image_url || '/placeholder.svg';
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (selectedVariant?.original_price && selectedVariant.original_price > selectedVariant.price) {
      return Math.round(((selectedVariant.original_price - selectedVariant.price) / selectedVariant.original_price) * 100);
    }
    return 0;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
          .insert([{
            user_id: user.id,
            product_id: product.id,
            variant_id: selectedVariant.id,
            quantity: 1
          }]);

        if (error) throw error;
      }

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

  const handleIncrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    incrementQuantity();
  };

  const handleDecrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    decrementQuantity();
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi! I want to buy ${selectedVariant.variant_name} - ${product.name} for ₹${selectedVariant.price}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-border">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-muted/10 flex items-center justify-center p-4">
        <Link to={`/product/${product.id}`} className="h-full w-full flex items-center justify-center">
          <img
            src={getVariantImage()}
            alt={selectedVariant.variant_name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <Badge className="bg-purple-600 text-white px-2 py-1 text-xs font-bold">
              NEW
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-yellow-600 text-black px-2 py-1 text-xs font-bold">
              FEATURED
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-green-600 text-white px-2 py-1 text-xs font-bold">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
            isInWishlist(product.id)
              ? 'bg-red-600 text-white'
              : 'bg-black/50 text-white hover:bg-purple-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-foreground text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Reviews */}
        <div className="flex items-center justify-between">
          {reviewStats && reviewStats.total_reviews > 0 ? (
            <ReviewStars 
              rating={reviewStats.average_rating} 
              totalReviews={reviewStats.total_reviews} 
              showText={true}
              size="sm"
            />
          ) : (
            <span className="text-muted-foreground text-xs">No reviews yet</span>
          )}
        </div>

        {/* Variant Options */}
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variants</p>
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 4).map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleVariantChange(variant.id);
                  }}
                  className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                    selectedVariant.id === variant.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {variant.flavor ? `${variant.flavor} - ${variant.size}` : variant.size}
                </button>
              ))}
              {product.variants.length > 4 && (
                <Link to={`/product/${product.id}`} className="px-2 py-1 text-xs rounded-md border border-border hover:bg-muted text-primary">
                  +{product.variants.length - 4} more
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-xl font-bold">
              ₹{selectedVariant.price.toFixed(0)}
            </span>
            {selectedVariant?.original_price && selectedVariant.original_price > selectedVariant.price && (
              <span className="text-muted-foreground text-sm line-through">
                ₹{selectedVariant.original_price.toFixed(0)}
              </span>
            )}
          </div>
          {selectedVariant.stock_quantity <= 10 && selectedVariant.stock_quantity > 0 && (
            <p className="text-orange-400 text-xs">Only {selectedVariant.stock_quantity} left!</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {quantity > 0 ? (
            <div className="flex items-center bg-primary rounded-lg overflow-hidden flex-1">
              <Button
                size="sm"
                onClick={handleDecrementQuantity}
                disabled={loading}
                className="bg-primary/80 hover:bg-primary text-primary-foreground px-2 py-1 rounded-none h-8 min-w-8"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="bg-primary text-primary-foreground px-2 py-1 text-sm font-bold min-w-8 text-center flex items-center justify-center h-8">
                {quantity}
              </span>
              <Button
                size="sm"
                onClick={handleIncrementQuantity}
                disabled={loading || quantity >= selectedVariant.stock_quantity}
                className="bg-primary/80 hover:bg-primary text-primary-foreground px-2 py-1 rounded-none h-8 min-w-8"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={loading || selectedVariant.stock_quantity === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 text-sm font-bold flex-1"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              ADD TO CART
            </Button>
          )}
          
          <Button
            size="sm"
            onClick={handleQuickBuy}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1 text-sm font-bold"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            BUY
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernProductCard;