import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  button_text?: string;
  banner_type: string;
  position: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const { toast } = useToast();

  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    button_text: '',
    banner_type: 'promotional',
    position: 'top',
    is_active: true,
    display_order: 0,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBanner = async () => {
    try {
      const bannerData = {
        ...bannerForm,
        start_date: bannerForm.start_date ? new Date(bannerForm.start_date).toISOString() : null,
        end_date: bannerForm.end_date ? new Date(bannerForm.end_date).toISOString() : null
      };

      if (selectedBanner) {
        const { error } = await supabase
          .from('banners')
          .update({ ...bannerData, updated_at: new Date().toISOString() })
          .eq('id', selectedBanner.id);

        if (error) throw error;
        toast({ title: "Success", description: "Banner updated successfully" });
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);

        if (error) throw error;
        toast({ title: "Success", description: "Banner created successfully" });
      }

      setIsDialogOpen(false);
      setSelectedBanner(null);
      resetBannerForm();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: "Failed to save banner",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Banner deleted successfully" });
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive"
      });
    }
  };

  const editBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setBannerForm({
      title: banner.title,
      description: banner.description || '',
      image_url: banner.image_url || '',
      link_url: banner.link_url || '',
      button_text: banner.button_text || '',
      banner_type: banner.banner_type,
      position: banner.position,
      is_active: banner.is_active,
      display_order: banner.display_order,
      start_date: banner.start_date ? new Date(banner.start_date).toISOString().split('T')[0] : '',
      end_date: banner.end_date ? new Date(banner.end_date).toISOString().split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      button_text: '',
      banner_type: 'promotional',
      position: 'top',
      is_active: true,
      display_order: 0,
      start_date: '',
      end_date: ''
    });
  };

  const openAddDialog = () => {
    setSelectedBanner(null);
    resetBannerForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background text-foreground border-input">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title" className="text-foreground">Banner Title</Label>
                <Input
                  id="title"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Banner title"
                  className="bg-background text-foreground border-input"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Banner description"
                  className="bg-background text-foreground border-input"
                />
              </div>

              <div>
                <ImageUpload
                  onImageUploaded={(url) => setBannerForm(prev => ({ ...prev, image_url: url }))}
                  currentImage={bannerForm.image_url}
                  folder="banners"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="link_url" className="text-foreground">Link URL</Label>
                  <Input
                    id="link_url"
                    value={bannerForm.link_url}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, link_url: e.target.value }))}
                    placeholder="https://example.com"
                    className="bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label htmlFor="button_text" className="text-foreground">Button Text</Label>
                  <Input
                    id="button_text"
                    value={bannerForm.button_text}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, button_text: e.target.value }))}
                    placeholder="Learn More"
                    className="bg-background text-foreground border-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banner_type" className="text-foreground">Banner Type</Label>
                  <Select value={bannerForm.banner_type} onValueChange={(value) => setBannerForm(prev => ({ ...prev, banner_type: value }))}>
                    <SelectTrigger className="bg-background text-foreground border-input">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground border-input">
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position" className="text-foreground">Position</Label>
                  <Select value={bannerForm.position} onValueChange={(value) => setBannerForm(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger className="bg-background text-foreground border-input">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground border-input">
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="hero">Hero Section</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date" className="text-foreground">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={bannerForm.start_date}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label htmlFor="end_date" className="text-foreground">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={bannerForm.end_date}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="bg-background text-foreground border-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order" className="text-foreground">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={bannerForm.display_order}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="bg-background text-foreground border-input"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="is_active"
                    checked={bannerForm.is_active}
                    onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active" className="text-foreground">Active</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-foreground border-input hover:bg-muted">
                Cancel
              </Button>
              <Button onClick={handleSaveBanner} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {selectedBanner ? 'Update' : 'Create'} Banner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{banner.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{banner.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => editBanner(banner)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteBanner(banner.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {banner.banner_type}
                </div>
                <div>
                  <span className="font-medium">Position:</span> {banner.position}
                </div>
                <div>
                  <span className="font-medium">Order:</span> {banner.display_order}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {banner.start_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(banner.start_date).toLocaleDateString()} - {banner.end_date ? new Date(banner.end_date).toLocaleDateString() : 'No end date'}
                    </span>
                  </div>
                )}
              </div>
              {banner.image_url && (
                <div className="mt-4">
                  <img src={banner.image_url} alt={banner.title} className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BannerManagement;