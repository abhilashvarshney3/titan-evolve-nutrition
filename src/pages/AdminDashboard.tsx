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
  Save
} from 'lucide-react';

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
  const [contentSettings, setContentSettings] = useState<ContentSetting[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
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

      // Load content settings (using dynamic query since types not updated yet)
      const { data: contentData, error: contentError } = await supabase
        .from('content_settings' as any)
        .select('*')
        .order('key');

      if (contentError) throw contentError;
      setContentSettings((contentData as any) || []);

      // Load testimonials (using dynamic query since types not updated yet)
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

  // Testimonial management functions
  const handleSaveTestimonial = async () => {
    try {
      if (selectedItem) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials' as any)
          .update(testimonialForm)
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast({ title: "Success", description: "Testimonial updated successfully" });
      } else {
        // Create new testimonial
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

  // Content management functions
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
        // Update existing content
        const { error } = await supabase
          .from('content_settings' as any)
          .update(contentData)
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast({ title: "Success", description: "Content updated successfully" });
      } else {
        // Create new content
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
              <p className="text-xs text-blue-400">{stats.featuredProducts} featured</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</div>
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
            <TabsTrigger value="content" className="data-[state=active]:bg-red-600">Content</TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-red-600">Testimonials</TabsTrigger>
          </TabsList>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400">PRODUCT MANAGEMENT</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      setSelectedItem(null);
                      resetProductForm();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-red-400">
                      {selectedItem ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={productForm.image_url}
                        onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={productForm.is_featured}
                        onCheckedChange={(checked) => setProductForm({...productForm, is_featured: checked})}
                      />
                      <Label>Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={productForm.is_new}
                        onCheckedChange={(checked) => setProductForm({...productForm, is_new: checked})}
                      />
                      <Label>New Product</Label>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button onClick={handleSaveProduct} className="bg-red-600 hover:bg-red-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Product
                    </Button>
                    <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-bold">Product</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Price</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Stock</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Status</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-gray-800">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.image_url && (
                              <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded" />
                            )}
                            <div>
                              <div className="text-white font-medium">{product.name}</div>
                              <div className="text-gray-400 text-sm">{product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white">${product.price}</td>
                        <td className="p-4 text-white">{product.stock_quantity}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {product.is_featured && <Badge className="bg-blue-600">Featured</Badge>}
                            {product.is_new && <Badge className="bg-green-600">New</Badge>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => editProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-600 text-red-400" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400">CONTENT MANAGEMENT</h2>
              <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      setSelectedItem(null);
                      resetContentForm();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-red-400">
                      {selectedItem ? 'Edit Content' : 'Add New Content'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="key">Content Key</Label>
                      <Input
                        id="key"
                        value={contentForm.key}
                        onChange={(e) => setContentForm({...contentForm, key: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                        disabled={!!selectedItem}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={contentForm.description}
                        onChange={(e) => setContentForm({...contentForm, description: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="value">Content Value (JSON)</Label>
                      <Textarea
                        id="value"
                        value={contentForm.value}
                        onChange={(e) => setContentForm({...contentForm, value: e.target.value})}
                        className="bg-gray-800 border-gray-700 h-40"
                        placeholder='{"key": "value"}'
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button onClick={handleSaveContent} className="bg-red-600 hover:bg-red-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Content
                    </Button>
                    <Button variant="outline" onClick={() => setIsContentDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-bold">Key</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Description</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentSettings.map((content) => (
                      <tr key={content.id} className="border-t border-gray-800">
                        <td className="p-4 text-white font-medium">{content.key}</td>
                        <td className="p-4 text-gray-300">{content.description}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => editContent(content)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Testimonials Management */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400">TESTIMONIALS MANAGEMENT</h2>
              <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      setSelectedItem(null);
                      resetTestimonialForm();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-red-400">
                      {selectedItem ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={testimonialForm.company}
                        onChange={(e) => setTestimonialForm({...testimonialForm, company: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm({...testimonialForm, rating: parseInt(e.target.value)})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="content">Testimonial Content</Label>
                      <Textarea
                        id="content"
                        value={testimonialForm.content}
                        onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={testimonialForm.image_url}
                        onChange={(e) => setTestimonialForm({...testimonialForm, image_url: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={testimonialForm.display_order}
                        onChange={(e) => setTestimonialForm({...testimonialForm, display_order: parseInt(e.target.value)})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={testimonialForm.is_active}
                        onCheckedChange={(checked) => setTestimonialForm({...testimonialForm, is_active: checked})}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button onClick={handleSaveTestimonial} className="bg-red-600 hover:bg-red-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Testimonial
                    </Button>
                    <Button variant="outline" onClick={() => setIsTestimonialDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-bold">Name</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Role/Company</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Rating</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Status</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial.id} className="border-t border-gray-800">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {testimonial.image_url && (
                              <img src={testimonial.image_url} alt={testimonial.name} className="w-10 h-10 object-cover rounded-full" />
                            )}
                            <div className="text-white font-medium">{testimonial.name}</div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">
                          {testimonial.role && testimonial.company 
                            ? `${testimonial.role} at ${testimonial.company}`
                            : testimonial.role || testimonial.company
                          }
                        </td>
                        <td className="p-4 text-white">{'⭐'.repeat(testimonial.rating)}</td>
                        <td className="p-4">
                          <Badge className={testimonial.is_active ? "bg-green-600" : "bg-gray-600"}>
                            {testimonial.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => editTestimonial(testimonial)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-600 text-red-400" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;