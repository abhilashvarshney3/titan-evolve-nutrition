import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Settings,
  MessageSquare,
  FileText,
  Save,
  Upload
} from 'lucide-react';
import CodeUploadSection from '@/components/admin/CodeUploadSection';
import ReviewManagement from '@/components/admin/ReviewManagement';
import { getAllProducts, CentralizedProduct } from '@/data/centralizedProducts';
import ProductVariantManager from '@/components/admin/ProductVariantManager';

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
  stock_quantity: number;
  sku?: string;
  is_active: boolean;
}

interface ContentSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
}

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  image_url?: string;
  is_active: boolean;
  display_order: number;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [contentSettings, setContentSettings] = useState<ContentSetting[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
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
    product_id: '',
    variant_name: '',
    flavor: '',
    size: '',
    price: '',
    stock_quantity: '',
    sku: '',
    is_active: true
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    image_url: '',
    is_active: true,
    display_order: 0
  });

  const [contentForm, setContentForm] = useState({
    key: '',
    value: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Load product variants
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .order('product_id');

      if (variantsError) throw variantsError;
      setVariants(variantsData || []);

      // Load content settings
      const { data: contentData, error: contentError } = await supabase
        .from('content_settings' as any)
        .select('*')
        .order('key');

      if (contentError) throw contentError;
      setContentSettings((contentData as any) || []);

      // Load testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials' as any)
        .select('*')
        .order('display_order');

      if (testimonialsError) throw testimonialsError;
      setTestimonials((testimonialsData as any) || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Product management functions
  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock_quantity: parseInt(productForm.stock_quantity)
      };

      if (selectedItem) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast({ title: "Success", description: "Product created successfully" });
      }

      setIsProductDialogOpen(false);
      setSelectedItem(null);
      resetProductForm();
      loadData();
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
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Product deleted successfully" });
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  // Variant management functions
  const handleSaveVariant = async () => {
    try {
      const variantData = {
        ...variantForm,
        price: parseFloat(variantForm.price),
        stock_quantity: parseInt(variantForm.stock_quantity)
      };

      if (selectedItem) {
        // Update existing variant
        const { error } = await supabase
          .from('product_variants')
          .update(variantData)
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast({ title: "Success", description: "Variant updated successfully" });
      } else {
        // Create new variant
        const { error } = await supabase
          .from('product_variants')
          .insert([variantData]);

        if (error) throw error;
        toast({ title: "Success", description: "Variant created successfully" });
      }

      setIsVariantDialogOpen(false);
      setSelectedItem(null);
      resetVariantForm();
      loadData();
    } catch (error) {
      console.error('Error saving variant:', error);
      toast({
        title: "Error",
        description: "Failed to save variant",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVariant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Variant deleted successfully" });
      loadData();
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast({
        title: "Error",
        description: "Failed to delete variant",
        variant: "destructive"
      });
    }
  };

  // Other management functions remain the same...
  const handleSaveTestimonial = async () => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('testimonials' as any)
          .update(testimonialForm)
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast({ title: "Success", description: "Testimonial updated successfully" });
      } else {
        const { error } = await supabase
          .from('testimonials' as any)
          .insert([testimonialForm]);

        if (error) throw error;
        toast({ title: "Success", description: "Testimonial created successfully" });
      }

      setIsTestimonialDialogOpen(false);
      setSelectedItem(null);
      resetTestimonialForm();
      loadData();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Testimonial deleted successfully" });
      loadData();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive"
      });
    }
  };

  const handleSaveContent = async () => {
    try {
      let value;
      try {
        value = JSON.parse(contentForm.value);
      } catch {
        value = contentForm.value;
      }

      const contentData = {
        ...contentForm,
        value: value
      };

      if (selectedItem) {
        const { error } = await supabase
          .from('content_settings' as any)
          .update(contentData)
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast({ title: "Success", description: "Content updated successfully" });
      } else {
        const { error } = await supabase
          .from('content_settings' as any)
          .insert([contentData]);

        if (error) throw error;
        toast({ title: "Success", description: "Content created successfully" });
      }

      setIsContentDialogOpen(false);
      setSelectedItem(null);
      resetContentForm();
      loadData();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    }
  };

  // Reset form functions
  const resetProductForm = () => {
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
  };

  const resetVariantForm = () => {
    setVariantForm({
      product_id: '',
      variant_name: '',
      flavor: '',
      size: '',
      price: '',
      stock_quantity: '',
      sku: '',
      is_active: true
    });
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      image_url: '',
      is_active: true,
      display_order: 0
    });
  };

  const resetContentForm = () => {
    setContentForm({
      key: '',
      value: '',
      description: ''
    });
  };

  // Edit functions
  const editProduct = (product: Product) => {
    setSelectedItem(product);
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
    setIsProductDialogOpen(true);
  };

  const editVariant = (variant: ProductVariant) => {
    setSelectedItem(variant);
    setVariantForm({
      product_id: variant.product_id,
      variant_name: variant.variant_name,
      flavor: variant.flavor || '',
      size: variant.size,
      price: variant.price.toString(),
      stock_quantity: variant.stock_quantity.toString(),
      sku: variant.sku || '',
      is_active: variant.is_active
    });
    setIsVariantDialogOpen(true);
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setSelectedItem(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      role: testimonial.role || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating,
      image_url: testimonial.image_url || '',
      is_active: testimonial.is_active,
      display_order: testimonial.display_order
    });
    setIsTestimonialDialogOpen(true);
  };

  const editContent = (content: ContentSetting) => {
    setSelectedItem(content);
    setContentForm({
      key: content.key,
      value: JSON.stringify(content.value, null, 2),
      description: content.description || ''
    });
    setIsContentDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const stats = {
    totalRevenue: products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0),
    totalProducts: products.length,
    totalVariants: variants.length,
    featuredProducts: products.filter(p => p.is_featured).length,
    newProducts: products.filter(p => p.is_new).length,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-red-400">ADMIN DASHBOARD</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
              <p className="text-xs text-blue-400">{stats.totalVariants} variants</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-400">Total stock value</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">New Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.newProducts}</div>
              <p className="text-xs text-purple-400">Recently added</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Testimonials</CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{testimonials.length}</div>
              <p className="text-xs text-orange-400">{testimonials.filter(t => t.is_active).length} active</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-gray-900 p-1 rounded-xl">
            <TabsTrigger value="products" className="data-[state=active]:bg-red-600">Products</TabsTrigger>
            <TabsTrigger value="variants" className="data-[state=active]:bg-red-600">Variants</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-red-600">Reviews</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-red-600">Content</TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-red-600">Testimonials</TabsTrigger>
            <TabsTrigger value="codes" className="data-[state=active]:bg-red-600">Verification Codes</TabsTrigger>
          </TabsList>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400">PRODUCT MANAGEMENT</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setSelectedItem(null); resetProductForm(); }} className="bg-red-600 hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {selectedItem ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right text-gray-300">Name</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right text-gray-300">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right text-gray-300">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="stock" className="text-right text-gray-300">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sku" className="text-right text-gray-300">SKU</Label>
                      <Input
                        id="sku"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right text-gray-300">Image URL</Label>
                      <Input
                        id="image"
                        value={productForm.image_url}
                        onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={productForm.is_featured}
                          onCheckedChange={(checked) => setProductForm({...productForm, is_featured: checked})}
                        />
                        <Label htmlFor="featured" className="text-gray-300">Featured</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="new"
                          checked={productForm.is_new}
                          onCheckedChange={(checked) => setProductForm({...productForm, is_new: checked})}
                        />
                        <Label htmlFor="new" className="text-gray-300">New</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProduct} className="bg-red-600 hover:bg-red-700">
                      <Save className="mr-2 h-4 w-4" />
                      Save Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Enhanced Product Management with Variant Support */}
            <div className="space-y-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">{product.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ProductVariantManager 
                      productId={product.id} 
                      productName={product.name}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Variants Management */}
          <TabsContent value="variants" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400">VARIANT MANAGEMENT</h2>
              <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setSelectedItem(null); resetVariantForm(); }} className="bg-red-600 hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {selectedItem ? 'Edit Variant' : 'Add New Variant'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="product_id" className="text-right text-gray-300">Product</Label>
                      <select
                        id="product_id"
                        value={variantForm.product_id}
                        onChange={(e) => setVariantForm({...variantForm, product_id: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white rounded px-3 py-2"
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="variant_name" className="text-right text-gray-300">Variant Name</Label>
                      <Input
                        id="variant_name"
                        value={variantForm.variant_name}
                        onChange={(e) => setVariantForm({...variantForm, variant_name: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="flavor" className="text-right text-gray-300">Flavor</Label>
                      <Input
                        id="flavor"
                        value={variantForm.flavor}
                        onChange={(e) => setVariantForm({...variantForm, flavor: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="size" className="text-right text-gray-300">Size</Label>
                      <Input
                        id="size"
                        value={variantForm.size}
                        onChange={(e) => setVariantForm({...variantForm, size: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="variant_price" className="text-right text-gray-300">Price</Label>
                      <Input
                        id="variant_price"
                        type="number"
                        value={variantForm.price}
                        onChange={(e) => setVariantForm({...variantForm, price: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="variant_stock" className="text-right text-gray-300">Stock</Label>
                      <Input
                        id="variant_stock"
                        type="number"
                        value={variantForm.stock_quantity}
                        onChange={(e) => setVariantForm({...variantForm, stock_quantity: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="variant_sku" className="text-right text-gray-300">SKU</Label>
                      <Input
                        id="variant_sku"
                        value={variantForm.sku}
                        onChange={(e) => setVariantForm({...variantForm, sku: e.target.value})}
                        className="col-span-3 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="variant_active"
                        checked={variantForm.is_active}
                        onCheckedChange={(checked) => setVariantForm({...variantForm, is_active: checked})}
                      />
                      <Label htmlFor="variant_active" className="text-gray-300">Active</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsVariantDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveVariant} className="bg-red-600 hover:bg-red-700">
                      <Save className="mr-2 h-4 w-4" />
                      Save Variant
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2 text-gray-300">Product</th>
                        <th className="text-left p-2 text-gray-300">Variant</th>
                        <th className="text-left p-2 text-gray-300">Flavor</th>
                        <th className="text-left p-2 text-gray-300">Size</th>
                        <th className="text-left p-2 text-gray-300">Price</th>
                        <th className="text-left p-2 text-gray-300">Stock</th>
                        <th className="text-left p-2 text-gray-300">Status</th>
                        <th className="text-left p-2 text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant) => {
                        const product = products.find(p => p.id === variant.product_id);
                        return (
                          <tr key={variant.id} className="border-b border-gray-800">
                            <td className="p-2 text-white">{product?.name || 'Unknown'}</td>
                            <td className="p-2 text-white">{variant.variant_name}</td>
                            <td className="p-2 text-white">{variant.flavor || '-'}</td>
                            <td className="p-2 text-white">{variant.size}</td>
                            <td className="p-2 text-white">₹{variant.price}</td>
                            <td className="p-2 text-white">{variant.stock_quantity}</td>
                            <td className="p-2">
                              <Badge variant={variant.is_active ? "default" : "secondary"}>
                                {variant.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editVariant(variant)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteVariant(variant.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Management */}
          <TabsContent value="reviews">
            <ReviewManagement />
          </TabsContent>

          {/* Content Management - keeping existing implementation */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400">CONTENT MANAGEMENT</h2>
            </div>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <p className="text-gray-400">Content management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Management - keeping existing implementation */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400">TESTIMONIALS MANAGEMENT</h2>
            </div>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <p className="text-gray-400">Testimonials management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Codes Management */}
          <TabsContent value="codes">
            <CodeUploadSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
