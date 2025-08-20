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
import { Users, UserPlus, Edit, Trash2, Plus, TrendingUp, DollarSign } from 'lucide-react';

interface AffiliateProgram {
  id: string;
  name: string;
  description?: string;
  commission_rate: number;
  commission_type: 'percentage' | 'fixed';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Promoter {
  id: string;
  user_id: string;
  affiliate_program_id: string;
  referral_code: string;
  total_referrals: number;
  total_earnings: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Referral {
  id: string;
  promoter_id: string;
  order_id: string;
  referral_code: string;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  updated_at: string;
}

const AffiliateManagement = () => {
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [isPromoterDialogOpen, setIsPromoterDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<AffiliateProgram | null>(null);
  const [selectedPromoter, setSelectedPromoter] = useState<Promoter | null>(null);
  
  const [programForm, setProgramForm] = useState({
    name: '',
    description: '',
    commission_rate: 0,
    commission_type: 'percentage' as 'percentage' | 'fixed',
    is_active: true
  });

  const [promoterForm, setPromoterForm] = useState({
    user_email: '',
    affiliate_program_id: '',
    referral_code: '',
    is_active: true
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch affiliate programs
      const { data: programsData, error: programsError } = await supabase
        .from('affiliate_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (programsError) throw programsError;
      setPrograms((programsData || []).map(p => ({
        ...p,
        commission_type: p.commission_type as 'percentage' | 'fixed'
      })));

      // Fetch promoters  
      const { data: promotersData, error: promotersError } = await supabase
        .from('promoters')
        .select('*')
        .order('created_at', { ascending: false });

      if (promotersError) throw promotersError;
      setPromoters(promotersData || []);

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;
      setReferrals((referralsData || []).map(r => ({
        ...r,
        status: r.status as 'pending' | 'approved' | 'paid'
      })));

    } catch (error) {
      console.error('Error fetching affiliate data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch affiliate data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProgram = async () => {
    try {
      if (selectedProgram) {
        // Update existing program
        const { error } = await supabase
          .from('affiliate_programs')
          .update({
            ...programForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedProgram.id);

        if (error) throw error;
        toast({ title: "Success", description: "Program updated successfully" });
      } else {
        // Create new program
        const { error } = await supabase
          .from('affiliate_programs')
          .insert([programForm]);

        if (error) throw error;
        toast({ title: "Success", description: "Program created successfully" });
      }

      setIsProgramDialogOpen(false);
      setSelectedProgram(null);
      resetProgramForm();
      fetchData();
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Error",
        description: "Failed to save program",
        variant: "destructive"
      });
    }
  };

  const deleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const { error } = await supabase
        .from('affiliate_programs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Program deleted successfully" });
      fetchData();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive"
      });
    }
  };

  const generateReferralCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'REF';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPromoterForm(prev => ({ ...prev, referral_code: result }));
  };

  const updateReferralStatus = async (referralId: string, newStatus: 'pending' | 'approved' | 'paid') => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', referralId);

      if (error) throw error;
      toast({ title: "Success", description: "Referral status updated successfully" });
      fetchData();
    } catch (error) {
      console.error('Error updating referral status:', error);
      toast({
        title: "Error",
        description: "Failed to update referral status",
        variant: "destructive"
      });
    }
  };

  const editProgram = (program: AffiliateProgram) => {
    setSelectedProgram(program);
    setProgramForm({
      name: program.name,
      description: program.description || '',
      commission_rate: program.commission_rate,
      commission_type: program.commission_type,
      is_active: program.is_active
    });
    setIsProgramDialogOpen(true);
  };

  const resetProgramForm = () => {
    setProgramForm({
      name: '',
      description: '',
      commission_rate: 0,
      commission_type: 'percentage',
      is_active: true
    });
  };

  const resetPromoterForm = () => {
    setPromoterForm({
      user_email: '',
      affiliate_program_id: '',
      referral_code: '',
      is_active: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'paid': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading affiliate data...</div>;
  }

  const stats = {
    totalPrograms: programs.length,
    activePrograms: programs.filter(p => p.is_active).length,
    totalPromoters: promoters.length,
    activePromoters: promoters.filter(p => p.is_active).length,
    totalReferrals: referrals.length,
    pendingPayouts: referrals.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.commission_amount, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Affiliate Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePrograms}/{stats.totalPrograms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promoters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePromoters}/{stats.totalPromoters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.pendingPayouts}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="promoters">Promoters</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Affiliate Programs</h3>
            <Button onClick={() => { resetProgramForm(); setIsProgramDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Program
            </Button>
          </div>

          <div className="grid gap-4">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{program.name}</CardTitle>
                      <p className="text-sm text-gray-500">{program.description}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={program.is_active ? "default" : "secondary"}>
                        {program.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editProgram(program)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProgram(program.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <strong>Commission:</strong> {
                      program.commission_type === 'percentage' 
                        ? `${program.commission_rate}%` 
                        : `₹${program.commission_rate}`
                    }
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Created: {new Date(program.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="promoters" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Promoters</h3>
            <Button onClick={() => { resetPromoterForm(); setIsPromoterDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Promoter
            </Button>
          </div>

          <div className="grid gap-4">
            {promoters.map((promoter) => (
              <Card key={promoter.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-mono bg-gray-100 px-2 py-1 rounded">
                        {promoter.referral_code}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">User ID: {promoter.user_id}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={promoter.is_active ? "default" : "secondary"}>
                        {promoter.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Referrals:</span> {promoter.total_referrals}
                    </div>
                    <div>
                      <span className="font-medium">Total Earnings:</span> ₹{promoter.total_earnings}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Joined: {new Date(promoter.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Referrals</h3>
          </div>

          <div className="grid gap-4">
            {referrals.map((referral) => (
              <Card key={referral.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">Order #{referral.order_id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-gray-500">Code: {referral.referral_code}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge className={`${getStatusColor(referral.status)} text-white`}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </Badge>
                      <Select 
                        value={referral.status} 
                        onValueChange={(value: 'pending' | 'approved' | 'paid') => updateReferralStatus(referral.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Commission:</span> ₹{referral.commission_amount}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(referral.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Program Dialog */}
      <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedProgram ? 'Edit Program' : 'Create New Program'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                value={programForm.name}
                onChange={(e) => setProgramForm({...programForm, name: e.target.value})}
                placeholder="Influencer Program"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={programForm.description}
                onChange={(e) => setProgramForm({...programForm, description: e.target.value})}
                placeholder="Program description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commission_type">Commission Type</Label>
                <Select 
                  value={programForm.commission_type} 
                  onValueChange={(value: 'percentage' | 'fixed') => setProgramForm({...programForm, commission_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="commission_rate">Commission Rate *</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  value={programForm.commission_rate}
                  onChange={(e) => setProgramForm({...programForm, commission_rate: parseFloat(e.target.value)})}
                  placeholder={programForm.commission_type === 'percentage' ? '10' : '100'}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={programForm.is_active}
                onCheckedChange={(checked) => setProgramForm({...programForm, is_active: checked})}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsProgramDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveProgram}>
                {selectedProgram ? 'Update' : 'Create'} Program
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliateManagement;