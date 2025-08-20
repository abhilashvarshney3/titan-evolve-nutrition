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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tag, Edit, Trash2, Plus, Copy, Percent } from 'lucide-react';
import CouponUsageStats from './CouponUsageStats';

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    minimum_order_amount: 0,
    maximum_discount_amount: '',
    usage_limit: '',
    is_active: true,
    valid_from: '',
    valid_until: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      
      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (couponsError) throw couponsError;
      setCoupons((couponsData || []).map(c => ({
        ...c,
        discount_type: c.discount_type as 'percentage' | 'fixed'
      })));

    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error",
        description: "Failed to fetch coupons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCoupon = async () => {
    try {
      const couponData = {
        ...couponForm,
        maximum_discount_amount: couponForm.maximum_discount_amount ? parseFloat(couponForm.maximum_discount_amount) : null,
        usage_limit: couponForm.usage_limit ? parseInt(couponForm.usage_limit) : null,
        valid_until: couponForm.valid_until || null
      };

      if (selectedCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update({
            ...couponData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedCoupon.id);

        if (error) throw error;
        toast({ title: "Success", description: "Coupon updated successfully" });
      } else {
        // Create new coupon
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);

        if (error) throw error;
        toast({ title: "Success", description: "Coupon created successfully" });
      }

      setIsDialogOpen(false);
      setSelectedCoupon(null);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast({
        title: "Error",
        description: "Failed to save coupon",
        variant: "destructive"
      });
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Coupon deleted successfully" });
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive"
      });
    }
  };

  const toggleCouponStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ 
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Coupon ${!isActive ? 'activated' : 'deactivated'} successfully` 
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error updating coupon status:', error);
      toast({
        title: "Error",
        description: "Failed to update coupon status",
        variant: "destructive"
      });
    }
  };

  const copyCouponCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: "Copied!", description: "Coupon code copied to clipboard" });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy coupon code",
        variant: "destructive"
      });
    }
  };

  const editCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_order_amount: coupon.minimum_order_amount,
      maximum_discount_amount: coupon.maximum_discount_amount?.toString() || '',
      usage_limit: coupon.usage_limit?.toString() || '',
      is_active: coupon.is_active,
      valid_from: coupon.valid_from.split('T')[0], // Convert to date format
      valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const createNewCoupon = () => {
    setSelectedCoupon(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCouponForm(prev => ({ ...prev, code: result }));
  };

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setCouponForm({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      minimum_order_amount: 0,
      maximum_discount_amount: '',
      usage_limit: '',
      is_active: true,
      valid_from: today,
      valid_until: ''
    });
  };

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const getUsagePercentage = (usedCount: number, usageLimit?: number) => {
    if (!usageLimit) return 0;
    return Math.round((usedCount / usageLimit) * 100);
  };

  if (loading) {
    return <div className="text-center py-8">Loading coupons...</div>;
  }

  return (
    <div className="space-y-6">
      <CouponUsageStats />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <Button onClick={createNewCoupon}>
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.filter(c => c.is_active).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.filter(c => isExpired(c.valid_until)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.reduce((sum, c) => sum + c.used_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                      {coupon.code}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCouponCode(coupon.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  {coupon.description && (
                    <p className="text-sm text-gray-600">{coupon.description}</p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant={coupon.is_active ? "default" : "secondary"}>
                    {coupon.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {isExpired(coupon.valid_until) && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                  >
                    {coupon.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editCoupon(coupon)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCoupon(coupon.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Discount:</span> 
                  {coupon.discount_type === 'percentage' 
                    ? `${coupon.discount_value}%` 
                    : `₹${coupon.discount_value}`
                  }
                </div>
                <div>
                  <span className="font-medium">Min Order:</span> ₹{coupon.minimum_order_amount}
                </div>
                <div>
                  <span className="font-medium">Usage:</span> 
                  {coupon.usage_limit 
                    ? `${coupon.used_count}/${coupon.usage_limit} (${getUsagePercentage(coupon.used_count, coupon.usage_limit)}%)`
                    : `${coupon.used_count} (Unlimited)`
                  }
                </div>
                <div>
                  <span className="font-medium">Valid Until:</span> 
                  {coupon.valid_until 
                    ? new Date(coupon.valid_until).toLocaleDateString()
                    : 'No expiry'
                  }
                </div>
              </div>
              {coupon.maximum_discount_amount && (
                <div className="text-xs text-gray-500 mt-2">
                  Maximum discount: ₹{coupon.maximum_discount_amount}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coupon Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-background text-foreground border-input">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code" className="text-foreground">Coupon Code *</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                  placeholder="SAVE20"
                  required
                  className="bg-background text-foreground border-input"
                />
                <Button type="button" variant="outline" onClick={generateCouponCode}>
                  Generate
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                value={couponForm.description}
                onChange={(e) => setCouponForm({...couponForm, description: e.target.value})}
                placeholder="20% off on all orders"
                rows={2}
                className="bg-background text-foreground border-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount_type" className="text-foreground">Discount Type</Label>
                <Select 
                  value={couponForm.discount_type} 
                  onValueChange={(value: 'percentage' | 'fixed') => setCouponForm({...couponForm, discount_type: value})}
                >
                  <SelectTrigger className="bg-background text-foreground border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground border-input">
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discount_value" className="text-foreground">Discount Value *</Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={couponForm.discount_value}
                  onChange={(e) => setCouponForm({...couponForm, discount_value: parseFloat(e.target.value)})}
                  placeholder={couponForm.discount_type === 'percentage' ? '20' : '100'}
                  required
                  className="bg-background text-foreground border-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minimum_order_amount" className="text-foreground">Minimum Order Amount (₹)</Label>
              <Input
                id="minimum_order_amount"
                type="number"
                value={couponForm.minimum_order_amount}
                onChange={(e) => setCouponForm({...couponForm, minimum_order_amount: parseFloat(e.target.value)})}
                placeholder="0"
                className="bg-background text-foreground border-input"
              />
            </div>

            <div>
              <Label htmlFor="maximum_discount_amount" className="text-foreground">Maximum Discount Amount (₹)</Label>
              <Input
                id="maximum_discount_amount"
                type="number"
                value={couponForm.maximum_discount_amount}
                onChange={(e) => setCouponForm({...couponForm, maximum_discount_amount: e.target.value})}
                placeholder="Leave empty for no limit"
                className="bg-background text-foreground border-input"
              />
            </div>

            <div>
              <Label htmlFor="usage_limit" className="text-foreground">Usage Limit</Label>
              <Input
                id="usage_limit"
                type="number"
                value={couponForm.usage_limit}
                onChange={(e) => setCouponForm({...couponForm, usage_limit: e.target.value})}
                placeholder="Leave empty for unlimited"
                className="bg-background text-foreground border-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valid_from" className="text-foreground">Valid From</Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={couponForm.valid_from}
                  onChange={(e) => setCouponForm({...couponForm, valid_from: e.target.value})}
                  required
                  className="bg-background text-foreground border-input"
                />
              </div>
              <div>
                <Label htmlFor="valid_until" className="text-foreground">Valid Until</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={couponForm.valid_until}
                  onChange={(e) => setCouponForm({...couponForm, valid_until: e.target.value})}
                  className="bg-background text-foreground border-input"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={couponForm.is_active}
                onCheckedChange={(checked) => setCouponForm({...couponForm, is_active: checked})}
              />
              <Label htmlFor="is_active" className="text-foreground">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-foreground border-input hover:bg-muted">
                Cancel
              </Button>
              <Button onClick={saveCoupon} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {selectedCoupon ? 'Update' : 'Create'} Coupon
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponManagement;