import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';

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
  const { toast } = useToast();

  const [settingForm, setSettingForm] = useState({
    setting_key: '',
    setting_value: '',
    setting_type: 'text',
    category: 'general',
    description: '',
    is_public: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch site settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSetting = async () => {
    try {
      let value;
      try {
        if (settingForm.setting_type === 'json') {
          value = JSON.parse(settingForm.setting_value);
        } else if (settingForm.setting_type === 'number') {
          value = parseFloat(settingForm.setting_value);
        } else if (settingForm.setting_type === 'boolean') {
          value = settingForm.setting_value === 'true';
        } else {
          value = settingForm.setting_value;
        }
      } catch {
        value = settingForm.setting_value;
      }

      const settingData = {
        ...settingForm,
        setting_value: value
      };

      if (selectedSetting) {
        const { error } = await supabase
          .from('site_settings')
          .update({ ...settingData, updated_at: new Date().toISOString() })
          .eq('id', selectedSetting.id);

        if (error) throw error;
        toast({ title: "Success", description: "Setting updated successfully" });
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([settingData]);

        if (error) throw error;
        toast({ title: "Success", description: "Setting created successfully" });
      }

      setIsDialogOpen(false);
      setSelectedSetting(null);
      resetSettingForm();
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

  const handleDeleteSetting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Setting deleted successfully" });
      fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast({
        title: "Error",
        description: "Failed to delete setting",
        variant: "destructive"
      });
    }
  };

  const editSetting = (setting: SiteSetting) => {
    setSelectedSetting(setting);
    setSettingForm({
      setting_key: setting.setting_key,
      setting_value: typeof setting.setting_value === 'object' 
        ? JSON.stringify(setting.setting_value, null, 2) 
        : String(setting.setting_value),
      setting_type: setting.setting_type,
      category: setting.category,
      description: setting.description || '',
      is_public: setting.is_public
    });
    setIsDialogOpen(true);
  };

  const resetSettingForm = () => {
    setSettingForm({
      setting_key: '',
      setting_value: '',
      setting_type: 'text',
      category: 'general',
      description: '',
      is_public: true
    });
  };

  const openAddDialog = () => {
    setSelectedSetting(null);
    resetSettingForm();
    setIsDialogOpen(true);
  };

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SiteSetting[]>);

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
        <h2 className="text-2xl font-bold text-foreground">Content Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedSetting ? 'Edit Setting' : 'Add New Setting'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="setting_key" className="text-foreground">Setting Key</Label>
                  <Input
                    id="setting_key"
                    value={settingForm.setting_key}
                    onChange={(e) => setSettingForm(prev => ({ ...prev, setting_key: e.target.value }))}
                    placeholder="hero_title"
                    className="bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-foreground">Category</Label>
                  <select
                    id="category"
                    value={settingForm.category}
                    onChange={(e) => setSettingForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="general">General</option>
                    <option value="hero">Hero Section</option>
                    <option value="about">About Page</option>
                    <option value="contact">Contact Page</option>
                    <option value="footer">Footer</option>
                    <option value="header">Header</option>
                    <option value="theme">Theme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="setting_type" className="text-foreground">Data Type</Label>
                  <select
                    id="setting_type"
                    value={settingForm.setting_type}
                    onChange={(e) => setSettingForm(prev => ({ ...prev, setting_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="json">JSON</option>
                    <option value="url">URL</option>
                    <option value="color">Color</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="is_public" 
                    checked={settingForm.is_public}
                    onChange={(e) => setSettingForm(prev => ({ ...prev, is_public: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="is_public" className="text-foreground">Public (visible on frontend)</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Input
                  id="description"
                  value={settingForm.description}
                  onChange={(e) => setSettingForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this setting"
                  className="bg-background text-foreground border-input"
                />
              </div>

              <div>
                <Label htmlFor="setting_value" className="text-foreground">Value</Label>
                {settingForm.setting_type === 'textarea' ? (
                  <Textarea
                    id="setting_value"
                    value={settingForm.setting_value}
                    onChange={(e) => setSettingForm(prev => ({ ...prev, setting_value: e.target.value }))}
                    placeholder="Setting value"
                    rows={4}
                    className="bg-background text-foreground border-input"
                  />
                ) : settingForm.setting_type === 'json' ? (
                  <Textarea
                    id="setting_value"
                    value={settingForm.setting_value}
                    onChange={(e) => setSettingForm(prev => ({ ...prev, setting_value: e.target.value }))}
                    placeholder='{"key": "value"}'
                    rows={6}
                    className="bg-background text-foreground border-input"
                  />
                ) : settingForm.setting_type === 'boolean' ? (
                  <select
                    id="setting_value"
                    value={settingForm.setting_value}
                    onChange={(e) => setSettingForm(prev => ({ ...prev, setting_value: e.target.value }))}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <Input
                    id="setting_value"
                    type={settingForm.setting_type === 'number' ? 'number' : 
                          settingForm.setting_type === 'url' ? 'url' :
                          settingForm.setting_type === 'color' ? 'color' : 'text'}
                    value={settingForm.setting_value}
                    onChange={(e) => setSettingForm(prev => ({ ...prev, setting_value: e.target.value }))}
                    placeholder="Setting value"
                    className="bg-background text-foreground border-input"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSetting}>
                <Save className="w-4 h-4 mr-2" />
                {selectedSetting ? 'Update' : 'Create'} Setting
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <Card key={category} className="bg-card text-foreground">
            <CardHeader>
              <CardTitle className="capitalize text-foreground">{category} Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{setting.setting_key}</h4>
                        {setting.is_public && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Public
                          </span>
                        )}
                      </div>
                      {setting.description && (
                        <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                      )}
                      <div className="mt-2">
                        <span className="text-sm font-medium text-foreground">Current value: </span>
                        <span className="text-sm text-foreground">
                          {typeof setting.setting_value === 'object' 
                            ? JSON.stringify(setting.setting_value) 
                            : String(setting.setting_value)
                          }
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Type: {setting.setting_type} | Category: {setting.category}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editSetting(setting)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteSetting(setting.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {Object.keys(groupedSettings).length === 0 && (
          <Card className="bg-card text-foreground">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No content settings found. Create your first setting to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;