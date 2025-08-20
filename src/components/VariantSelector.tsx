import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductVariant } from '@/data/centralizedProducts';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  className?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  className = ""
}) => {
  // Group variants by flavor if flavors exist
  const hasMultipleFlavors = variants.some(v => v.flavor) && 
    [...new Set(variants.map(v => v.flavor))].length > 1;
  
  const hasSizes = [...new Set(variants.map(v => v.size))].length > 1;

  const flavors = hasMultipleFlavors ? [...new Set(variants.map(v => v.flavor).filter(Boolean))] : [];
  const sizes = hasSizes ? [...new Set(variants.map(v => v.size))] : [];

  const handleFlavorChange = (flavor: string) => {
    const newVariant = variants.find(v => v.flavor === flavor && v.size === selectedVariant.size);
    if (newVariant) {
      onVariantChange(newVariant);
    }
  };

  const handleSizeChange = (size: string) => {
    const newVariant = variants.find(v => v.size === size && 
      (selectedVariant.flavor ? v.flavor === selectedVariant.flavor : true));
    if (newVariant) {
      onVariantChange(newVariant);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {hasMultipleFlavors && (
        <div>
          <label className="text-sm font-medium text-gray-300 mb-1 block">
            Flavor
          </label>
          <Select value={selectedVariant.flavor || ''} onValueChange={handleFlavorChange}>
            <SelectTrigger className="bg-gray-800 border-purple-600 text-white">
              <SelectValue placeholder="Select flavor" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-purple-600">
              {flavors.map((flavor) => (
                <SelectItem key={flavor} value={flavor} className="text-white hover:bg-purple-600">
                  {flavor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {hasSizes && (
        <div>
          <label className="text-sm font-medium text-gray-300 mb-1 block">
            Size
          </label>
          <Select value={selectedVariant.size} onValueChange={handleSizeChange}>
            <SelectTrigger className="bg-gray-800 border-purple-600 text-white">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-purple-600">
              {sizes.map((size) => (
                <SelectItem key={size} value={size} className="text-white hover:bg-purple-600">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="text-sm text-gray-400">
        <p>Stock: {selectedVariant.stockQuantity} available</p>
        <p>SKU: {selectedVariant.sku}</p>
      </div>
    </div>
  );
};

export default VariantSelector;