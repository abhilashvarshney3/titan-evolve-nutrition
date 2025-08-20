import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Edit, Plus, Save } from 'lucide-react';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  category: string;
  description?: string;
  is_public: boolean;
}

const ContentManagement = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SiteSetting | null>(null);
  const [settingForm, setSettingForm] = useState({
    setting_key: '',
    setting_value: '',
    setting_type: 'text',
    category: 'general',
    description: '',
    is_public: true
  });
  const { toast } = useToast();

  // Pre-defined content categories and their settings
  const contentCategories = {
    hero: [
      { key: 'hero_title', label: 'Hero Title', type: 'text', description: 'Main title on homepage' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text', description: 'Subtitle below main title' },
      { key: 'hero_description', label: 'Hero Description', type: 'text', description: 'Description text on hero section' },
      { key: 'hero_button_text', label: 'Button Text', type: 'text', description: 'Text for CTA button' },
      { key: 'hero_background_image', label: 'Background Image', type: 'image', description: 'Hero background image URL' }
    ],
    about: [
      { key: 'about_vision', label: 'Company Vision', type: 'text', description: 'Vision statement on about page' },
      { key: 'about_mission', label: 'Company Mission', type: 'text', description: 'Mission statement' },
      { key: 'about_story', label: 'Company Story', type: 'text', description: 'Company story/background' },
      { key: 'about_values', label: 'Company Values', type: 'json', description: 'List of company values (JSON array)' }
    ],
    contact: [
      { key: 'contact_email', label: 'Contact Email', type: 'text', description: 'Primary contact email' },
      { key: 'contact_phone', label: 'Contact Phone', type: 'text', description: 'Primary contact phone' },
      { key: 'contact_address', label: 'Contact Address', type: 'text', description: 'Physical address' },
      { key: 'contact_hours', label: 'Business Hours', type: 'text', description: 'Business operating hours' },
      { key: 'contact_map_url', label: 'Google Maps URL', type: 'url', description: 'Google Maps embed URL' }
    ],
    general: [
      { key: 'site_name', label: 'Site Name', type: 'text', description: 'Website name' },
      { key: 'site_tagline', label: 'Site Tagline', type: 'text', description: 'Website tagline' },
      { key: 'shipping_info', label: 'Shipping Info', type: 'text', description: 'Shipping information text' },
      { key: 'return_policy', label: 'Return Policy', type: 'text', description: 'Return policy text' },
      { key: 'support_email', label: 'Support Email', type: 'text', description: 'Customer support email' }
    ],
    social: [
      { key: 'facebook_url', label: 'Facebook URL', type: 'url', description: 'Facebook page URL' },
      { key: 'instagram_url', label: 'Instagram URL', type: 'url', description: 'Instagram profile URL' },
      { key: 'twitter_url', label: 'Twitter URL', type: 'url', description: 'Twitter profile URL' },
      { key: 'youtube_url', label: 'YouTube URL', type: 'url', description: 'YouTube channel URL' }
    ]
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (settingsError) throw settingsError;
      setSettings(settingsData || []);

    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async () => {
    try {
      let value;
      try {
        // Try to parse as JSON for complex values
        if (settingForm.setting_type === 'json') {
          value = JSON.parse(settingForm.setting_value);
        } else {
          value = settingForm.setting_value;
        }
      } catch {
        value = settingForm.setting_value;
      }

      const settingData = {
        ...settingForm,
        setting_value: JSON.stringify(value)
      };

      if (selectedSetting) {
        // Update existing setting
        const { error } = await supabase
          .from('site_settings')
          .update(settingData)
          .eq('id', selectedSetting.id);

        if (error) throw error;
        toast({ title: "Success", description: "Setting updated successfully" });
      } else {
        // Create new setting
        const { error } = await supabase
          .from('site_settings')
          .insert([settingData]);

        if (error) throw error;
        toast({ title: "Success", description: "Setting created successfully" });
      }

      setIsDialogOpen(false);
      setSelectedSetting(null);
      resetForm();
      fetchSettings();
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: "Error",
        description: "Failed to save setting",
        variant: "destructive"
      });
    }
  };

  const editSetting = (setting: SiteSetting) => {
    setSelectedSetting(setting);
    setSettingForm({
      setting_key: setting.setting_key,
      setting_value: typeof setting.setting_value === 'string' ? 
        setting.setting_value.replace(/^"|"$/g, '') : 
        JSON.stringify(setting.setting_value, null, 2),
      setting_type: setting.setting_type,
      category: setting.category,
      description: setting.description || '',
      is_public: setting.is_public
    });
    setIsDialogOpen(true);
  };

  const createNewSetting = (category: string, settingTemplate?: any) => {
    setSelectedSetting(null);
    if (settingTemplate) {
      setSettingForm({
        setting_key: settingTemplate.key,
        setting_value: '',
        setting_type: settingTemplate.type,
        category: category,
        description: settingTemplate.description,
        is_public: true
      });
    } else {
      resetForm();
      setSettingForm(prev => ({ ...prev, category }));
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setSettingForm({
      setting_key: '',
      setting_value: '',
      setting_type: 'text',
      category: 'general',
      description: '',
      is_public: true
    });
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  const renderCategoryContent = (category: string) => {
    const categorySettings = getSettingsByCategory(category);
    const templates = contentCategories[category as keyof typeof contentCategories] || [];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold capitalize">{category} Settings</h3>
          <Button onClick={() => createNewSetting(category)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Setting
          </Button>
        </div>
        
        {/* Quick create buttons for common settings */}
        {templates.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick create common settings:</p>
            <div className="flex flex-wrap gap-2">
              {templates.map((template) => {
                const exists = categorySettings.some(s => s.setting_key === template.key);
                if (exists) return null;
                return (
                  <Button
                    key={template.key}
                    variant="outline"
                    size="sm"
                    onClick={() => createNewSetting(category, template)}
                  >
                    {template.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {categorySettings.map((setting) => (
            <Card key={setting.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{setting.setting_key}</CardTitle>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editSetting(setting)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <strong>Value:</strong> {
                    typeof setting.setting_value === 'string' 
                      ? setting.setting_value.length > 100 
                        ? setting.setting_value.substring(0, 100) + '...' 
                        : setting.setting_value
                      : JSON.stringify(setting.setting_value)
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Type: {setting.setting_type} | Public: {setting.is_public ? 'Yes' : 'No'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading content settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          {renderCategoryContent('hero')}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          {renderCategoryContent('about')}
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          {renderCategoryContent('contact')}
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          {renderCategoryContent('general')}
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          {renderCategoryContent('social')}
        </TabsContent>
      </Tabs>

      {/* Setting Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSetting ? 'Edit Setting' : 'Create New Setting'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="setting_key">Setting Key</Label>
              <Input
                id="setting_key"
                value={settingForm.setting_key}
                onChange={(e) => setSettingForm({...settingForm, setting_key: e.target.value})}
                placeholder="e.g., hero_title"
                disabled={!!selectedSetting}
              />
            </div>
            
            <div>
              <Label htmlFor="setting_value">Setting Value</Label>
              {settingForm.setting_type === 'text' || settingForm.setting_type === 'url' ? (
                <Textarea
                  id="setting_value"
                  value={settingForm.setting_value}
                  onChange={(e) => setSettingForm({...settingForm, setting_value: e.target.value})}
                  placeholder="Enter the value"
                  rows={3}
                />
              ) : (
                <Textarea
                  id="setting_value"
                  value={settingForm.setting_value}
                  onChange={(e) => setSettingForm({...settingForm, setting_value: e.target.value})}
                  placeholder={settingForm.setting_type === 'json' ? '["value1", "value2"]' : 'Enter the value'}
                  rows={4}
                />
              )}
            </div>

            <div>
              <Label htmlFor="setting_type">Setting Type</Label>
              <Select value={settingForm.setting_type} onValueChange={(value) => setSettingForm({...settingForm, setting_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="image">Image URL</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={settingForm.category} onValueChange={(value) => setSettingForm({...settingForm, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={settingForm.description}
                onChange={(e) => setSettingForm({...settingForm, description: e.target.value})}
                placeholder="Brief description of this setting"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveSetting}>
                <Save className="w-4 h-4 mr-2" />
                {selectedSetting ? 'Update' : 'Create'} Setting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;