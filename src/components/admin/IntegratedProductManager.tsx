import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  Settings,
  Save,
  X,
  Upload,
  Grid3X3,
  Layers
} from 'lucide-react';
import ImageUpload from './ImageUpload';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  stock_quantity: number;
  is_featured: boolean;
  is_new: boolean;
  image_url?: string;
  sku?: string;
}

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

const IntegratedProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantImages, setVariantImages] = useState<VariantImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    is_featured: false,
    is_new: false,
    image_url: '',
    sku: ''
  });

  const [variantForm, setVariantForm] = useState({
    variant_name: '',
    flavor: '',
    size: '',
    price: '',
    original_price: '',
    stock_quantity: '',
    sku: '',
    is_active: true
  });

  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [customFields, setCustomFields] = useState<Array<{ title: string; value: string }>>([]);

  useEffect(() => {
    loadData();

    // Listen for admin updates
    const handleProductsUpdated = () => {
      console.log('Admin triggered refresh - reloading data');
      loadData();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, variantsRes, imagesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('product_variants').select('*').order('product_id'),
        supabase.from('variant_images').select('*').order('display_order')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (variantsRes.error) throw variantsRes.error;
      if (imagesRes.error) throw imagesRes.error;

      setProducts(productsRes.data || []);
      setVariants(variantsRes.data || []);
      setVariantImages(imagesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock_quantity: product.stock_quantity.toString(),
        is_featured: product.is_featured,
        is_new: product.is_new,
        image_url: product.image_url || '',
        sku: product.sku || ''
      });
      setProductVariants(variants.filter(v => v.product_id === product.id));
    } else {
      setSelectedProduct(null);
      resetForms();
      setProductVariants([]);
    }
    setIsDialogOpen(true);
    setActiveTab('overview');
  };

  const resetForms = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      is_featured: false,
      is_new: false,
      image_url: '',
      sku: ''
    });
    setVariantForm({
      variant_name: '',
      flavor: '',
      size: '',
      price: '',
      original_price: '',
      stock_quantity: '',
      sku: '',
      is_active: true
    });
    setCustomFields([]);
    setEditingVariant(null);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock_quantity: parseInt(productForm.stock_quantity)
      };

      let productId = selectedProduct?.id;

      if (selectedProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id);
        if (error) throw error;
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        if (error) throw error;
        productId = data.id;
        toast({ title: "Success", description: "Product created successfully" });
      }

      // Save variants
      for (const variant of productVariants) {
        const variantData = {
          ...variant,
          product_id: productId,
          price: parseFloat(variant.price.toString()),
          stock_quantity: parseInt(variant.stock_quantity.toString()),
          product_details: variant.product_details || undefined
        };

        console.log('💾 Admin: Saving variant to database:', {
          variantId: variant.id,
          variantData,
          product_details: variantData.product_details
        });

        if (variant.id && variant.id.startsWith('temp-')) {
          // New variant
          const { id, ...newVariantData } = variantData;
          const { data, error } = await supabase
            .from('product_variants')
            .insert([newVariantData])
            .select();
          if (error) throw error;
          console.log('💾 Admin: New variant saved:', data);
        } else if (variant.id) {
          // Update existing variant
          const { data, error } = await supabase
            .from('product_variants')
            .update(variantData)
            .eq('id', variant.id)
            .select();
          if (error) throw error;
          console.log('💾 Admin: Existing variant updated:', data);
        }
      }

      setIsDialogOpen(false);
      loadData();
      // Trigger global refresh for frontend components
      window.dispatchEvent(new CustomEvent('productsUpdated'));
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product and all its variants?')) return;
    
    try {
      // First delete verification codes that reference this product
      const { error: codesError } = await supabase
        .from('verification_codes')
        .delete()
        .eq('product_id', id);
      
      if (codesError) {
        console.warn('Error deleting verification codes:', codesError);
      }

      // Then delete the product (variants will be deleted automatically due to CASCADE)
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Success", description: "Product deleted successfully" });
      loadData();
      // Trigger global refresh for frontend components
      window.dispatchEvent(new CustomEvent('productsUpdated'));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const editVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVariantForm({
      variant_name: variant.variant_name,
      flavor: variant.flavor || '',
      size: variant.size,
      price: variant.price.toString(),
      original_price: variant.original_price?.toString() || '',
      stock_quantity: variant.stock_quantity.toString(),
      sku: variant.sku || '',
      is_active: variant.is_active
    });
    
    // Parse existing product details if they exist
    if (variant.product_details) {
      try {
        const details = JSON.parse(variant.product_details);
        if (Array.isArray(details)) {
          setCustomFields(details);
        } else {
          setCustomFields([]);
        }
      } catch {
        setCustomFields([]);
      }
    } else {
      setCustomFields([]);
    }
  };

  const updateVariant = () => {
    if (!editingVariant) return;

    const productDetailsString = customFields.length > 0 ? JSON.stringify(customFields) : undefined;
    console.log('🔧 Admin: Updating variant with product details:', {
      variantId: editingVariant.id,
      customFields,
      productDetailsString
    });

    const updatedVariant: ProductVariant = {
      ...editingVariant,
      variant_name: variantForm.variant_name,
      flavor: variantForm.flavor,
      size: variantForm.size,
      price: parseFloat(variantForm.price),
      original_price: variantForm.original_price ? parseFloat(variantForm.original_price) : undefined,
      stock_quantity: parseInt(variantForm.stock_quantity),
      sku: variantForm.sku,
      is_active: variantForm.is_active,
      product_details: productDetailsString
    };

    console.log('🔧 Admin: Updated variant object:', updatedVariant);
    setProductVariants(productVariants.map(v => v.id === editingVariant.id ? updatedVariant : v));
    setVariantForm({
      variant_name: '',
      flavor: '',
      size: '',
      price: '',
      original_price: '',
      stock_quantity: '',
      sku: '',
      is_active: true
    });
    setCustomFields([]);
    setEditingVariant(null);
  };

  const cancelEditVariant = () => {
    setEditingVariant(null);
    setVariantForm({
      variant_name: '',
      flavor: '',
      size: '',
      price: '',
      original_price: '',
      stock_quantity: '',
      sku: '',
      is_active: true
    });
    setCustomFields([]);
  };

  const addVariant = () => {
        const newVariant: ProductVariant = {
          id: `temp-${Date.now()}`,
          product_id: selectedProduct?.id || '',
          variant_name: variantForm.variant_name,
          flavor: variantForm.flavor,
          size: variantForm.size,
          price: parseFloat(variantForm.price),
          original_price: variantForm.original_price ? parseFloat(variantForm.original_price) : undefined,
          stock_quantity: parseInt(variantForm.stock_quantity),
          sku: variantForm.sku,
          is_active: variantForm.is_active,
          product_details: customFields.length > 0 ? JSON.stringify(customFields) : undefined
        };
    
    setProductVariants([...productVariants, newVariant]);
    setVariantForm({
      variant_name: '',
      flavor: '',
      size: '',
      price: '',
      original_price: '',
      stock_quantity: '',
      sku: '',
      is_active: true
    });
    setCustomFields([]);
  };

  const removeVariant = async (variantId: string) => {
    if (variantId.startsWith('temp-')) {
      setProductVariants(productVariants.filter(v => v.id !== variantId));
    } else {
      try {
        const { error } = await supabase
          .from('product_variants')
          .delete()
          .eq('id', variantId);
        if (error) throw error;
        setProductVariants(productVariants.filter(v => v.id !== variantId));
        toast({ title: "Success", description: "Variant deleted successfully" });
        // Trigger global refresh
        window.dispatchEvent(new CustomEvent('productsUpdated'));
      } catch (error) {
        console.error('Error deleting variant:', error);
        toast({
          title: "Error",
          description: "Failed to delete variant",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddVariantImage = async (variantId: string, imageUrl: string) => {
    try {
      // Check if variant exists - if it's a temp variant, we can't add images yet
      if (variantId.startsWith('temp-')) {
        toast({
          title: "Warning",
          description: "Please save the product first before adding variant images.",
          variant: "destructive"
        });
        return;
      }

      const existingImages = variantImages.filter(img => img.variant_id === variantId);
      const displayOrder = existingImages.length;
      const isPrimary = existingImages.length === 0;

      const { data, error } = await supabase
        .from('variant_images')
        .insert([{
          variant_id: variantId,
          image_url: imageUrl,
          is_primary: isPrimary,
          display_order: displayOrder
        }])
        .select()
        .single();

      if (error) throw error;

      setVariantImages([...variantImages, data]);
      toast({ title: "Success", description: "Image added successfully" });
      
      // Trigger global refresh
      window.dispatchEvent(new CustomEvent('productsUpdated'));
    } catch (error) {
      console.error('Error adding variant image:', error);
      toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVariantImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('variant_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setVariantImages(variantImages.filter(img => img.id !== imageId));
      toast({ title: "Success", description: "Image deleted successfully" });
      
      // Trigger global refresh
      window.dispatchEvent(new CustomEvent('productsUpdated'));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      });
    }
  };

  const getProductVariantCount = (productId: string) => {
    return variants.filter(v => v.product_id === productId).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Product Management
          </h3>
          <p className="text-muted-foreground">Manage products and their variants in one place</p>
        </div>
        <Button onClick={() => openProductDialog()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold truncate">
                    {product.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.is_featured && (
                      <Badge variant="secondary" className="text-xs">Featured</Badge>
                    )}
                    {product.is_new && (
                      <Badge variant="outline" className="text-xs">New</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openProductDialog(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">₹{product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span>{product.stock_quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Variants:</span>
                  <span className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    {getProductVariantCount(product.id)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5" />
              {selectedProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Variants
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Images
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                    placeholder="Enter SKU"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    placeholder="Enter price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Product Image</Label>
                <ImageUpload
                  onImageUploaded={(url) => setProductForm({...productForm, image_url: url})}
                  currentImage={productForm.image_url}
                  folder="products"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={productForm.is_featured}
                    onCheckedChange={(checked) => setProductForm({...productForm, is_featured: checked})}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new"
                    checked={productForm.is_new}
                    onCheckedChange={(checked) => setProductForm({...productForm, is_new: checked})}
                  />
                  <Label htmlFor="new">New Product</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingVariant ? 'Edit Variant' : 'Add New Variant'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="variant-name">Variant Name</Label>
                      <Input
                        id="variant-name"
                        value={variantForm.variant_name}
                        onChange={(e) => setVariantForm({...variantForm, variant_name: e.target.value})}
                        placeholder="e.g., Chocolate Flavor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flavor">Flavor</Label>
                      <Input
                        id="flavor"
                        value={variantForm.flavor}
                        onChange={(e) => setVariantForm({...variantForm, flavor: e.target.value})}
                        placeholder="e.g., Chocolate"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        value={variantForm.size}
                        onChange={(e) => setVariantForm({...variantForm, size: e.target.value})}
                        placeholder="e.g., 1kg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="variant-price">Price (₹)</Label>
                      <Input
                        id="variant-price"
                        type="number"
                        value={variantForm.price}
                        onChange={(e) => setVariantForm({...variantForm, price: e.target.value})}
                        placeholder="Enter discounted price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-original-price">Original Price (₹)</Label>
                      <Input
                        id="variant-original-price"
                        type="number"
                        value={variantForm.original_price || ''}
                        onChange={(e) => setVariantForm({...variantForm, original_price: e.target.value})}
                        placeholder="Enter original price (optional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-stock">Stock</Label>
                      <Input
                        id="variant-stock"
                        type="number"
                        value={variantForm.stock_quantity}
                        onChange={(e) => setVariantForm({...variantForm, stock_quantity: e.target.value})}
                        placeholder="Enter stock"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-sku">SKU</Label>
                      <Input
                        id="variant-sku"
                        value={variantForm.sku}
                        onChange={(e) => setVariantForm({...variantForm, sku: e.target.value})}
                        placeholder="Enter SKU"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editingVariant ? (
                      <>
                        <Button
                          onClick={updateVariant}
                          disabled={!variantForm.variant_name || !variantForm.size || !variantForm.price}
                          className="w-full sm:w-auto"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Update Variant
                        </Button>
                        <Button
                          onClick={cancelEditVariant}
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={addVariant}
                        disabled={!variantForm.variant_name || !variantForm.size || !variantForm.price}
                        className="w-full sm:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    )}
                  </div>

                  {/* Custom Fields Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Variant-Specific Product Details</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomFields([...customFields, { title: '', value: '' }])}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Detail
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add variant-specific details that will be displayed on the product page under "Product Information" (e.g., Ingredients, Nutritional Info, Usage Instructions). These details are unique to each variant.
                    </p>
                    
                    <div className="space-y-3">
                      {customFields.map((field, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Detail title (e.g., Ingredients)"
                              value={field.title}
                              onChange={(e) => {
                                const updatedFields = [...customFields];
                                updatedFields[index].title = e.target.value;
                                setCustomFields(updatedFields);
                              }}
                            />
                            <Input
                              placeholder="Detail value (e.g., Whey Protein, Creatine)"
                              value={field.value}
                              onChange={(e) => {
                                const updatedFields = [...customFields];
                                updatedFields[index].value = e.target.value;
                                setCustomFields(updatedFields);
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedFields = customFields.filter((_, i) => i !== index);
                              setCustomFields(updatedFields);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {customFields.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground border border-dashed rounded-lg">
                          No custom details added. Click "Add Detail" to start adding product-specific information.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h4 className="font-semibold">Product Variants ({productVariants.length})</h4>
                {productVariants.map((variant) => (
                  <Card key={variant.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="font-medium">{variant.variant_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {variant.flavor && `${variant.flavor} • `}
                            {variant.size} • ₹{variant.price}
                            {variant.original_price && ` (was ₹${variant.original_price})`}
                            • Stock: {variant.stock_quantity}
                          </div>
                          {variant.sku && (
                            <div className="text-xs text-muted-foreground">SKU: {variant.sku}</div>
                          )}
                          {variant.product_details && (() => {
                            try {
                              const details = JSON.parse(variant.product_details);
                              if (Array.isArray(details) && details.length > 0) {
                                return (
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Details:</span> {details.length} item(s) added
                                  </div>
                                );
                              }
                            } catch (error) {
                              if (variant.product_details.trim()) {
                                return (
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Details:</span> Custom details added
                                  </div>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={variant.is_active ? "default" : "secondary"}>
                            {variant.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editVariant(variant)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(variant.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {productVariants.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No variants added yet. Add a variant above to get started.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 mt-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Variant Images</h4>
                {productVariants.map((variant) => (
                  <Card key={variant.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{variant.variant_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Current Images</Label>
                          <div className="flex flex-wrap gap-2">
                            {variantImages
                              .filter(img => img.variant_id === variant.id)
                              .sort((a, b) => a.display_order - b.display_order)
                              .map((image) => (
                                <div key={image.id} className="relative group">
                                  <img
                                    src={image.image_url}
                                    alt="Variant"
                                    className="w-20 h-20 object-cover rounded border"
                                  />
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteVariantImage(image.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  {image.is_primary && (
                                    <Badge className="absolute bottom-0 left-0 text-xs" variant="secondary">
                                      Primary
                                    </Badge>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Add Image</Label>
                          <ImageUpload
                            onImageUploaded={(url) => handleAddVariantImage(variant.id, url)}
                            folder="variants"
                            key={`variant-${variant.id}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {productVariants.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No variants available. Add variants first to manage their images.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {selectedProduct ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegratedProductManager;