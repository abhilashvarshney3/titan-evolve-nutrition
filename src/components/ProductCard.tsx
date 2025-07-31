
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart, MessageCircle, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartQuantity } from '@/hooks/useCartQuantity';
import { products } from '@/data/products';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  description: string;
}

const ProductCard = ({
  id,
  name,
  category,
  price,
  originalPrice,
  image,
  rating = 4.8,
  reviewCount = 247,
  badge,
  description
}: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { quantity, loading, incrementQuantity, decrementQuantity, addToCart } = useCartQuantity(id);
  const isOnSale = originalPrice && originalPrice > price;

  // Get the correct image from products data
  const productData = products.find(p => p.id === id);
  const correctImage = productData?.image || image;

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
    const whatsappUrl = `https://wa.me/919650602521?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/product/${id}`}>
          <img
            src={correctImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
            <Badge variant="destructive" className="px-2 py-1 text-xs font-bold">
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
              : 'bg-black/50 text-white hover:bg-red-600/80'
          }`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <span className="text-red-400 text-xs font-bold tracking-wider uppercase">
          {category}
        </span>
        
        {/* Title */}
        <Link to={`/product/${id}`}>
          <h3 className="text-white text-lg font-bold line-clamp-2 group-hover:text-red-400 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-400 text-xs">({reviewCount})</span>
        </div>

        {/* Price and Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-xl font-bold">
              ₹{price.toFixed(0)}
            </span>
            {originalPrice && (
              <span className="text-gray-500 text-sm line-through">
                ₹{originalPrice.toFixed(0)}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            {quantity > 0 ? (
              // Quantity Controls
              <div className="flex items-center bg-purple-600 rounded-lg overflow-hidden flex-1">
                <Button
                  size="sm"
                  onClick={handleDecrementQuantity}
                  disabled={loading}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-none h-8"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="bg-purple-600 text-white px-3 py-2 text-sm font-bold min-w-[40px] text-center">
                  {quantity}
                </span>
                <Button
                  size="sm"
                  onClick={handleIncrementQuantity}
                  disabled={loading}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-none h-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              // Add to Cart Button
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm font-bold flex-1"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                ADD TO CART
              </Button>
            )}
            
            {/* Quick Buy Button */}
            <Button
              onClick={handleQuickBuy}
              size="sm"
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1 text-sm font-bold"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              BUY
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
