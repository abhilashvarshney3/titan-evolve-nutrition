import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatabaseProductVariant } from '@/hooks/useProducts';

interface VariantSelectorProps {
  variants: DatabaseProductVariant[];
  selectedVariant: DatabaseProductVariant;
  onVariantChange: (variant: DatabaseProductVariant) => void;
  className?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  className
}) => {
  // Clean and normalize flavors to prevent duplicates
  const normalizedVariants = variants.map(variant => ({
    ...variant,
    flavor: variant.flavor?.trim() || 'Default'
  }));

  // Create unique flavor groups
  const flavorGroups = normalizedVariants.reduce((groups: { [key: string]: DatabaseProductVariant[] }, variant) => {
    const flavor = variant.flavor || 'Default';
    if (!groups[flavor]) {
      groups[flavor] = [];
    }
    groups[flavor].push(variant);
    return groups;
  }, {});

  // Get truly unique flavors
  const uniqueFlavors = Object.keys(flavorGroups).sort();
  const hasFlavors = uniqueFlavors.length > 1 || (uniqueFlavors.length === 1 && uniqueFlavors[0] !== 'Default');

  console.log('VariantSelector Debug:', {
    variants: normalizedVariants,
    flavorGroups,
    uniqueFlavors,
    selectedVariant
  });

  const handleFlavorChange = (flavor: string): void => {
    const variantsInFlavor = flavorGroups[flavor];
    if (variantsInFlavor && variantsInFlavor.length > 0) {
      // Find variant with same size if possible, otherwise take first
      const sameSize = variantsInFlavor.find(v => v.size === selectedVariant.size);
      onVariantChange(sameSize || variantsInFlavor[0]);
    }
  };

  const handleSizeChange = (size: string): void => {
    const currentFlavor = selectedVariant.flavor || 'Default';
    const variantsInFlavor = flavorGroups[currentFlavor];
    const variantWithSize = variantsInFlavor?.find(v => v.size === size);
    if (variantWithSize) {
      onVariantChange(variantWithSize);
    }
  };

  // Get available sizes for current flavor
  const currentFlavor = selectedVariant.flavor || 'Default';
  const availableSizes = flavorGroups[currentFlavor]?.map(v => v.size) || [];
  const uniqueSizes = [...new Set(availableSizes)].filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {hasFlavors && (
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">Flavor</label>
          <Select
            value={selectedVariant.flavor || 'Default'}
            onValueChange={handleFlavorChange}
          >
            <SelectTrigger className="bg-gray-700/90 border-purple-400/50 text-white hover:bg-gray-600/90 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800/98 backdrop-blur-md border-purple-400/50 shadow-2xl">
              {uniqueFlavors.map(flavor => (
                <SelectItem key={flavor} value={flavor} className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30">
                  {flavor === 'Default' ? 'Standard' : flavor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(uniqueSizes.length > 1 || (hasFlavors && uniqueSizes.length > 0)) && (
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">Size</label>
          <Select
            value={selectedVariant.size}
            onValueChange={handleSizeChange}
          >
            <SelectTrigger className="bg-gray-700/90 border-purple-400/50 text-white hover:bg-gray-600/90 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800/98 backdrop-blur-md border-purple-400/50 shadow-2xl">
              {uniqueSizes.map(size => (
                <SelectItem key={size} value={size} className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="text-xs text-gray-400 space-y-1 p-2 bg-gray-800/30 rounded-md">
        <div>
          {selectedVariant.stock_quantity > 0 ? (
            <span className="text-green-400">✓ In Stock</span>
          ) : (
            <span className="text-red-400">✗ Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantSelector;