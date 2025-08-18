
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart, MessageCircle, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartQuantity } from '@/hooks/useCartQuantity';
import { useProductReviews } from '@/hooks/useProductReviews';
import { products } from '@/data/products';
import ReviewStars from '@/components/ReviewStars';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  mrp?: number;
  discount?: number;
  image: string;
  badge?: string;
  description: string;
}

const ProductCard = ({
  id,
  name,
  category,
  price,
  originalPrice,
  mrp,
  discount,
  image,
  badge,
  description
}: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { quantity, loading, incrementQuantity, decrementQuantity, addToCart } = useCartQuantity(id);
  const { stats: reviewStats } = useProductReviews(id);
  const isOnSale = originalPrice && originalPrice > price;

  // Get the correct image from products data
  const productData = products.find(p => p.id === id);
  const correctImage = productData?.image || image;

  // Function to get weight display based on category
  const getWeightDisplay = () => {
    if (!productData) return '';
    
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('mass gainer') || categoryLower.includes('gainer')) {
      // For gainers, extract weight from name (6lbs or 10lbs)
      const weightMatch = name.match(/(\d+)lbs/);
      return weightMatch ? `${weightMatch[1]}lbs` : '';
    } else if (categoryLower.includes('protein') || categoryLower.includes('whey')) {
      // For protein, show in kgs
      return productData.details.weight || '2kg';
    } else if (categoryLower.includes('pre-workout') || categoryLower.includes('creatine')) {
      // For pre-workout and creatine, show servings
      return productData.details.servings || '';
    }
    
    return productData.details.weight || '';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
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

    addToCart(name);
  };

  const handleIncrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    incrementQuantity(name);
  };

  const handleDecrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    decrementQuantity(name);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id, name);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi! I'm interested in purchasing ${name} (₹${price}). Can you help me with the order?`;
    const whatsappUrl = `https://wa.me/919211991181?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const weightDisplay = getWeightDisplay();

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-800 flex items-center justify-center p-4">
        <Link to={`/product/${id}`} className="h-full w-full flex items-center justify-center">
          <img
            src={correctImage}
            alt={name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {badge && (
            <Badge className="bg-red-600 text-white px-2 py-1 text-xs font-bold">
              {badge}
            </Badge>
          )}
          {isOnSale && (
            <Badge className="bg-green-600 text-white px-2 py-1 text-xs font-bold">
              SALE
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
            isInWishlist(id)
              ? 'bg-red-600 text-white'
              : 'bg-black/50 text-white hover:bg-purple-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <span className="text-purple-400 text-xs font-bold tracking-wider uppercase">
          {category}
        </span>
        
        {/* Title */}
        <Link to={`/product/${id}`}>
          <h3 className="text-white text-lg font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Weight Display */}
        {weightDisplay && (
          <div className="text-gray-300 text-sm font-medium">
            {weightDisplay}
          </div>
        )}

        {/* Reviews */}
        {reviewStats && reviewStats.total_reviews > 0 ? (
          <ReviewStars 
            rating={reviewStats.average_rating} 
            totalReviews={reviewStats.total_reviews} 
            showText={true}
            size="sm"
          />
        ) : (
          <span className="text-gray-500 text-xs">No reviews yet</span>
        )}

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2">
          {description}
        </p>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-white text-xl font-bold">
              ₹{price.toFixed(0)}
            </span>
            {mrp && (
              <span className="text-gray-500 text-sm line-through">
                ₹{mrp.toFixed(0)}
              </span>
            )}
          </div>
          {discount && (
            <span className="text-green-400 text-xs font-bold">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {quantity > 0 ? (
            // Quantity Controls - Compact and responsive
            <div className="flex items-center bg-purple-600 rounded-lg overflow-hidden">
              <Button
                size="sm"
                onClick={handleDecrementQuantity}
                disabled={loading}
                className="bg-purple-700 hover:bg-purple-800 text-white px-2 py-1 rounded-none h-8 min-w-8"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="bg-purple-600 text-white px-2 py-1 text-sm font-bold min-w-8 text-center flex items-center justify-center h-8">
                {quantity}
              </span>
              <Button
                size="sm"
                onClick={handleIncrementQuantity}
                disabled={loading}
                className="bg-purple-700 hover:bg-purple-800 text-white px-2 py-1 rounded-none h-8 min-w-8"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            // Add to Cart Button - Purple theme
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm font-bold"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              ADD TO CART
            </Button>
          )}
          
          {/* Quick Buy Button */}
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

export default ProductCard;
