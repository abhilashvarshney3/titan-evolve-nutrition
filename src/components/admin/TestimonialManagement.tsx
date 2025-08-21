import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Edit, Trash2, Plus, Star } from 'lucide-react';
import ImageUpload from './ImageUpload';

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
  created_at: string;
  updated_at: string;
}

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
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
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (testimonialsError) throw testimonialsError;
      setTestimonials(testimonialsData || []);

    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTestimonial = async () => {
    try {
      if (selectedTestimonial) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update({
            ...testimonialForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTestimonial.id);

        if (error) throw error;
        toast({ title: "Success", description: "Testimonial updated successfully" });
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialForm]);

        if (error) throw error;
        toast({ title: "Success", description: "Testimonial created successfully" });
      }

      setIsDialogOpen(false);
      setSelectedTestimonial(null);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive"
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Testimonial deleted successfully" });
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive"
      });
    }
  };

  const toggleTestimonialStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ 
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Testimonial ${!isActive ? 'activated' : 'deactivated'} successfully` 
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial status",
        variant: "destructive"
      });
    }
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
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
    setIsDialogOpen(true);
  };

  const createNewTestimonial = () => {
    setSelectedTestimonial(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setTestimonialForm({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      image_url: '',
      is_active: true,
      display_order: testimonials.length
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Testimonial Management</h2>
        <Button onClick={createNewTestimonial}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials.filter(t => t.is_active).length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testimonials.length > 0 
                ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                : '0.0'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials List */}
      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="bg-card text-foreground">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {testimonial.image_url && (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-base text-foreground">{testimonial.name}</CardTitle>
                      {testimonial.role && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                          {testimonial.company && ` at ${testimonial.company}`}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                    {testimonial.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTestimonialStatus(testimonial.id, testimonial.is_active)}
                  >
                    {testimonial.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editTestimonial(testimonial)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTestimonial(testimonial.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">"{testimonial.content}"</p>
              <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                <span>Display Order: {testimonial.display_order}</span>
                <span>Added: {new Date(testimonial.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Testimonial Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">Name *</Label>
              <Input
                id="name"
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                placeholder="Customer name"
                required
                className="bg-background text-foreground border-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role" className="text-foreground">Role</Label>
                <Input
                  id="role"
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                  placeholder="Job title"
                  className="bg-background text-foreground border-input"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-foreground">Company</Label>
                <Input
                  id="company"
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm({...testimonialForm, company: e.target.value})}
                  placeholder="Company name"
                  className="bg-background text-foreground border-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content" className="text-foreground">Testimonial Content *</Label>
              <Textarea
                id="content"
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                placeholder="The testimonial text..."
                rows={4}
                required
                className="bg-background text-foreground border-input"
              />
            </div>

            <div>
              <Label htmlFor="rating" className="text-foreground">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={testimonialForm.rating}
                onChange={(e) => setTestimonialForm({...testimonialForm, rating: parseInt(e.target.value)})}
                required
                className="bg-background text-foreground border-input"
              />
            </div>

            <div>
              <Label htmlFor="image_url" className="text-foreground">Profile Image</Label>
              <ImageUpload
                onImageUploaded={(url) => setTestimonialForm({...testimonialForm, image_url: url})}
                currentImage={testimonialForm.image_url}
                folder="testimonials"
              />
            </div>

            <div>
              <Label htmlFor="display_order" className="text-foreground">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={testimonialForm.display_order}
                onChange={(e) => setTestimonialForm({...testimonialForm, display_order: parseInt(e.target.value)})}
                placeholder="0"
                className="bg-background text-foreground border-input"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={testimonialForm.is_active}
                onCheckedChange={(checked) => setTestimonialForm({...testimonialForm, is_active: checked})}
              />
              <Label htmlFor="is_active" className="text-foreground">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveTestimonial}>
                {selectedTestimonial ? 'Update' : 'Create'} Testimonial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialManagement;