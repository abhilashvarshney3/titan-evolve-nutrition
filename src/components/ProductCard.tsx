
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';

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
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-purple-600 text-white px-3 py-1 text-xs font-semibold">
            {badge}
          </Badge>
        </div>
      )}

      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="destructive" className="px-3 py-1 text-xs font-semibold">
            SALE
          </Badge>
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-purple-600 font-medium">{category}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
