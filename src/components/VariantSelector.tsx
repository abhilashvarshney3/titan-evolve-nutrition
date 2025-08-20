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
  // Group variants by flavor to handle duplicate flavors properly
  const flavorGroups = variants.reduce((groups: { [key: string]: DatabaseProductVariant[] }, variant) => {
    const flavor = variant.flavor || 'Default';
    if (!groups[flavor]) {
      groups[flavor] = [];
    }
    groups[flavor].push(variant);
    return groups;
  }, {});

  // Remove duplicates by keeping only unique flavor names
  const uniqueFlavors = Object.keys(flavorGroups);
  const hasFlavors = uniqueFlavors.length > 1 || (uniqueFlavors.length === 1 && uniqueFlavors[0] !== 'Default');

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
  const uniqueSizes = [...new Set(availableSizes)];

  return (
    <div className={`space-y-4 ${className}`}>
      {hasFlavors && (
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">Flavor</label>
          <Select
            value={selectedVariant.flavor || 'Default'}
            onValueChange={handleFlavorChange}
          >
            <SelectTrigger className="bg-muted/20 border-border/50 text-foreground hover:bg-muted/30 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl">
              {uniqueFlavors.map(flavor => (
                <SelectItem key={flavor} value={flavor} className="hover:bg-muted/30 focus:bg-muted/30">
                  {flavor === 'Default' ? 'Standard' : flavor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {uniqueSizes.length > 1 && (
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">Size</label>
          <Select
            value={selectedVariant.size}
            onValueChange={handleSizeChange}
          >
            <SelectTrigger className="bg-muted/20 border-border/50 text-foreground hover:bg-muted/30 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl">
              {uniqueSizes.map(size => (
                <SelectItem key={size} value={size} className="hover:bg-muted/30 focus:bg-muted/30">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="text-xs text-muted-foreground/80 space-y-1 p-2 bg-muted/10 rounded-md">
        <div>Stock: {selectedVariant.stock_quantity} available</div>
        {selectedVariant.sku && <div>SKU: {selectedVariant.sku}</div>}
      </div>
    </div>
  );
};

export default VariantSelector;