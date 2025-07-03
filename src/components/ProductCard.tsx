
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart } from 'lucide-react';

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
  const isOnSale = originalPrice && originalPrice > price;

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
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
        <button className="absolute top-3 right-3 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70">
          <Heart className="h-4 w-4 text-white" />
        </button>
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2">
            <ShoppingCart className="h-4 w-4 mr-2" />
            QUICK ADD
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <span className="text-red-400 text-xs font-bold tracking-wider uppercase">
          {category}
        </span>
        
        {/* Title */}
        <h3 className="text-white text-lg font-bold line-clamp-2 group-hover:text-red-400 transition-colors">
          {name}
        </h3>

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
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-gray-500 text-sm line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 text-sm font-bold"
          >
            ADD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
