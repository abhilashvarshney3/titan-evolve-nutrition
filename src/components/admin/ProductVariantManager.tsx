import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';

interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  flavor?: string;
  size: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  sku?: string;
  is_active: boolean;
  product_details?: string;
}

interface VariantImage {
  id: string;
  variant_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

interface ProductVariantManagerProps {
  productId: string;
  productName: string;
}

const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({ productId, productName }) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantImages, setVariantImages] = useState<Record<string, VariantImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedVariantForImages, setSelectedVariantForImages] = useState<string | null>(null);
  const { toast } = useToast();

  const [variantForm, setVariantForm] = useState({
    variant_name: '',
    flavor: '',
    size: '',
    price: '',
    original_price: '',
    stock_quantity: '',
    sku: '',
    is_active: true,
    product_details: ''
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  const fetchVariants = async () => {
    try {
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: true });

      if (variantsError) throw variantsError;

      setVariants(variantsData || []);

      // Fetch images for all variants
      if (variantsData && variantsData.length > 0) {
        const variantIds = variantsData.map(v => v.id);
        const { data: imagesData, error: imagesError } = await supabase
          .from('variant_images')
          .select('*')
          .in('variant_id', variantIds)
          .order('display_order', { ascending: true });

        if (imagesError) throw imagesError;

        // Group images by variant_id
        const imagesByVariant: Record<string, VariantImage[]> = {};
        imagesData?.forEach(image => {
          if (!imagesByVariant[image.variant_id]) {
            imagesByVariant[image.variant_id] = [];
          }
          imagesByVariant[image.variant_id].push(image);
        });

        setVariantImages(imagesByVariant);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product variants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVariant = () => {
    setSelectedVariant(null);
    setVariantForm({
      variant_name: '',
      flavor: '',
      size: '',
      price: '',
      original_price: '',
      stock_quantity: '',
      sku: '',
      is_active: true,
      product_details: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setVariantForm({
      variant_name: variant.variant_name,
      flavor: variant.flavor || '',
      size: variant.size,
      price: variant.price.toString(),
      original_price: variant.original_price?.toString() || '',
      stock_quantity: variant.stock_quantity.toString(),
      sku: variant.sku || '',
      is_active: variant.is_active,
      product_details: variant.product_details || ''
    });
    setIsDialogOpen(true);
  };

  const handleSaveVariant = async () => {
    try {
      const variantData = {
        product_id: productId,
        variant_name: variantForm.variant_name,
        flavor: variantForm.flavor || null,
        size: variantForm.size,
        price: parseFloat(variantForm.price),
        original_price: variantForm.original_price ? parseFloat(variantForm.original_price) : null,
        stock_quantity: parseInt(variantForm.stock_quantity),
        sku: variantForm.sku || null,
        is_active: variantForm.is_active,
        product_details: variantForm.product_details || null
      };

      if (selectedVariant) {
        // Update existing variant
        const { error } = await supabase
          .from('product_variants')
          .update(variantData)
          .eq('id', selectedVariant.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Variant updated successfully",
        });
      } else {
        // Create new variant
        const { error } = await supabase
          .from('product_variants')
          .insert(variantData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Variant created successfully",
        });
      }

      setIsDialogOpen(false);
      fetchVariants();
    } catch (error) {
      console.error('Error saving variant:', error);
      toast({
        title: "Error",
        description: "Failed to save variant",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;

    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Variant deleted successfully",
      });
      fetchVariants();
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast({
        title: "Error",
        description: "Failed to delete variant",
        variant: "destructive",
      });
    }
  };

  const handleManageImages = (variantId: string) => {
    setSelectedVariantForImages(variantId);
    setNewImageUrl('');
    setImageDialogOpen(true);
  };

  const handleAddImage = async () => {
    if (!newImageUrl || !selectedVariantForImages) return;

    try {
      const images = variantImages[selectedVariantForImages] || [];
      const { error } = await supabase
        .from('variant_images')
        .insert({
          variant_id: selectedVariantForImages,
          image_url: newImageUrl,
          is_primary: images.length === 0, // First image is primary
          display_order: images.length
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image added successfully",
      });
      setNewImageUrl('');
      fetchVariants();
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('variant_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      fetchVariants();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimaryImage = async (imageId: string, variantId: string) => {
    try {
      // First, set all images for this variant to non-primary
      await supabase
        .from('variant_images')
        .update({ is_primary: false })
        .eq('variant_id', variantId);

      // Then set the selected image as primary
      const { error } = await supabase
        .from('variant_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Primary image updated successfully",
      });
      fetchVariants();
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({
        title: "Error",
        description: "Failed to set primary image",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading variants...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Variants for {productName}</h3>
        <Button onClick={handleCreateVariant}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      <div className="grid gap-4">
        {variants.map((variant) => (
          <Card key={variant.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{variant.variant_name}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    {variant.flavor && <Badge variant="secondary">{variant.flavor}</Badge>}
                    <Badge variant="outline">{variant.size}</Badge>
                    <Badge variant={variant.is_active ? "default" : "destructive"}>
                      {variant.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManageImages(variant.id)}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditVariant(variant)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteVariant(variant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Price:</span> ₹{variant.price}
                </div>
                <div>
                  <span className="font-medium">Stock:</span> {variant.stock_quantity}
                </div>
                <div>
                  <span className="font-medium">SKU:</span> {variant.sku || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Images:</span> {variantImages[variant.id]?.length || 0}
                </div>
              </div>
              
              {/* Show variant images */}
              {variantImages[variant.id] && variantImages[variant.id].length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {variantImages[variant.id].map((image) => (
                    <div key={image.id} className="relative flex-shrink-0">
                      <img
                        src={image.image_url}
                        alt="Variant"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      {image.is_primary && (
                        <Badge className="absolute -top-2 -right-2 text-xs px-1">Primary</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Variant Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedVariant ? 'Edit Variant' : 'Create New Variant'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="variant_name">Variant Name</Label>
              <Input
                id="variant_name"
                value={variantForm.variant_name}
                onChange={(e) => setVariantForm(prev => ({ ...prev, variant_name: e.target.value }))}
                placeholder="e.g., Double Rich Chocolate 2KG"
              />
            </div>
            <div>
              <Label htmlFor="flavor">Flavor (Optional)</Label>
              <Input
                id="flavor"
                value={variantForm.flavor}
                onChange={(e) => setVariantForm(prev => ({ ...prev, flavor: e.target.value }))}
                placeholder="e.g., Double Rich Chocolate"
              />
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={variantForm.size}
                onChange={(e) => setVariantForm(prev => ({ ...prev, size: e.target.value }))}
                placeholder="e.g., 2KG, 30 servings"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={variantForm.price}
                  onChange={(e) => setVariantForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="4999"
                />
              </div>
              <div>
                <Label htmlFor="original_price">Original Price (₹)</Label>
                <Input
                  id="original_price"
                  type="number"
                  value={variantForm.original_price}
                  onChange={(e) => setVariantForm(prev => ({ ...prev, original_price: e.target.value }))}
                  placeholder="5999"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={variantForm.stock_quantity}
                onChange={(e) => setVariantForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
                placeholder="35"
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input
                id="sku"
                value={variantForm.sku}
                onChange={(e) => setVariantForm(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="TE-LWP-DRC-2KG"
              />
            </div>
            <div>
              <Label htmlFor="product_details">Product Details (Optional)</Label>
              <Input
                id="product_details"
                value={variantForm.product_details}
                onChange={(e) => setVariantForm(prev => ({ ...prev, product_details: e.target.value }))}
                placeholder="e.g., Whey Protein Isolate, No Added Sugar"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVariant}>
                {selectedVariant ? 'Update' : 'Create'} Variant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Management Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Variant Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Add New Image */}
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1"
              />
              <Button onClick={handleAddImage} disabled={!newImageUrl}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Existing Images */}
            {selectedVariantForImages && variantImages[selectedVariantForImages] && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {variantImages[selectedVariantForImages].map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.image_url}
                      alt="Variant"
                      className="w-full h-32 object-cover rounded border"
                    />
                    {image.is_primary && (
                      <Badge className="absolute top-2 left-2 text-xs">Primary</Badge>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    {!image.is_primary && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute bottom-2 left-2 text-xs py-1 px-2 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleSetPrimaryImage(image.id, selectedVariantForImages)}
                      >
                        Set Primary
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductVariantManager;
