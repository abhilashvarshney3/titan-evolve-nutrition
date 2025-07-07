
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';

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
  const isOnSale = originalPrice && originalPrice > price;

  const handleQuickAdd = async (e: React.MouseEvent) => {
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
        .eq('product_id', id)
        .single();

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
              product_id: id,
              quantity: 1
            }
          ]);

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${name} has been added to your cart.`
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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id, name);
  };

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/product/${id}`}>
          <img
            src={image}
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

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
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
          
          <Button
            onClick={handleQuickAdd}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 text-sm font-bold"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            ADD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
