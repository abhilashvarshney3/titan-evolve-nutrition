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
import IntegratedProductManager from '@/components/admin/IntegratedProductManager';

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
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();

  // Form states
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

  // Other management functions
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">{stats.totalVariants} variants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total stock value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newProducts}</div>
              <p className="text-xs text-muted-foreground">Recently added</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testimonials.length}</div>
              <p className="text-xs text-muted-foreground">{testimonials.filter(t => t.is_active).length} active</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="codes">Verification Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <IntegratedProductManager />
          </TabsContent>

          {/* Reviews Management */}
          <TabsContent value="reviews">
            <ReviewManagement />
          </TabsContent>

          {/* Content Management - keeping existing implementation */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Content Management</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Content management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Management - keeping existing implementation */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Testimonials Management</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Testimonials management features coming soon...</p>
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
