import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Search, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  ShoppingBag,
  Plus,
  Trash2,
  Home
} from 'lucide-react';

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  type: string;
  is_default: boolean;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  totalUsers: number;
  adminUsers: number;
  customerUsers: number;
  recentSignups: number;
}

const EnhancedUserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [addressForm, setAddressForm] = useState({
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
    type: 'home',
    is_default: false
  });
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'customer'
  });
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    adminUsers: 0,
    customerUsers: 0,
    recentSignups: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setProfiles((profilesData || []).map(p => ({
        ...p,
        role: p.role as 'admin' | 'customer'
      })));

      if (profilesData) {
        const now = new Date();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentSignups = profilesData.filter(p => 
          new Date(p.created_at) > lastWeek
        ).length;

        setStats({
          totalUsers: profilesData.length,
          adminUsers: profilesData.filter(p => p.role === 'admin').length,
          customerUsers: profilesData.filter(p => p.role === 'customer').length,
          recentSignups
        });
      }

    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAddresses = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch addresses",
        variant: "destructive"
      });
    }
  };

  const fetchUserOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...userForm,
          role: userForm.role as 'admin' | 'customer',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully"
      });
      
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const saveAddress = async () => {
    if (!selectedUser) return;

    try {
      const addressData = {
        ...addressForm,
        user_id: selectedUser.id
      };

      if (editingAddress) {
        const { error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingAddress.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('addresses')
          .insert(addressData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Address ${editingAddress ? 'updated' : 'created'} successfully`
      });
      
      setIsAddressDialogOpen(false);
      setEditingAddress(null);
      fetchUserAddresses(selectedUser.id);
      resetAddressForm();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive"
      });
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address deleted successfully"
      });
      
      if (selectedUser) {
        fetchUserAddresses(selectedUser.id);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  const editUser = (user: Profile) => {
    setSelectedUser(user);
    setUserForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role
    });
    fetchUserAddresses(user.id);
    fetchUserOrders(user.id);
    setIsEditDialogOpen(true);
  };

  const editAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      first_name: address.first_name,
      last_name: address.last_name,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || '',
      type: address.type,
      is_default: address.is_default
    });
    setIsAddressDialogOpen(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      first_name: '',
      last_name: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      phone: '',
      type: 'home',
      is_default: false
    });
  };

  const filteredUsers = profiles.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.first_name?.toLowerCase().includes(searchLower) ||
        user.last_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'customer': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enhanced User Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentSignups}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48 bg-background text-foreground border-input">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground border-input z-50">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    {user.first_name || user.last_name ? 
                      `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                      'No Name'
                    }
                  </CardTitle>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge className={`${getRoleColor(user.role)} text-white`}>
                    {user.role}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editUser(user)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {user.email || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {user.phone || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {user.role}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-background text-foreground border-input max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">
              Manage User: {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-foreground">First Name</Label>
                  <Input
                    id="first_name"
                    value={userForm.first_name}
                    onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                    placeholder="First Name"
                    className="bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-foreground">Last Name</Label>
                  <Input
                    id="last_name"
                    value={userForm.last_name}
                    onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                    placeholder="Last Name"
                    className="bg-background text-foreground border-input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  placeholder="Email"
                  className="bg-background text-foreground border-input"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground">Phone</Label>
                <Input
                  id="phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  placeholder="Phone Number"
                  className="bg-background text-foreground border-input"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-foreground">Role</Label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm({...userForm, role: value})}>
                  <SelectTrigger className="bg-background text-foreground border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground border-input">
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-foreground border-input hover:bg-muted">
                  Cancel
                </Button>
                <Button onClick={updateUser} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Update User
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">User Addresses</h3>
                <Button onClick={() => {
                  resetAddressForm();
                  setEditingAddress(null);
                  setIsAddressDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </div>
              
              <div className="space-y-3">
                {userAddresses.map((address) => (
                  <Card key={address.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            <span className="font-medium">{address.first_name} {address.last_name}</span>
                            {address.is_default && <Badge variant="secondary">Default</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.address_line_1}<br />
                            {address.address_line_2 && <>{address.address_line_2}<br /></>}
                            {address.city}, {address.state} {address.postal_code}<br />
                            {address.country}
                          </p>
                          {address.phone && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {address.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editAddress(address)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteAddress(address.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <h3 className="text-lg font-semibold">User Orders</h3>
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Amount: ₹{order.total_amount}<br />
                            Payment: {order.payment_status}<br />
                            Date: {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="bg-background text-foreground border-input max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingAddress ? 'Edit Address' : 'Add Address'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addr_first_name" className="text-foreground">First Name</Label>
                <Input
                  id="addr_first_name"
                  value={addressForm.first_name}
                  onChange={(e) => setAddressForm({...addressForm, first_name: e.target.value})}
                  placeholder="First Name"
                  className="bg-background text-foreground border-input"
                />
              </div>
              <div>
                <Label htmlFor="addr_last_name" className="text-foreground">Last Name</Label>
                <Input
                  id="addr_last_name"
                  value={addressForm.last_name}
                  onChange={(e) => setAddressForm({...addressForm, last_name: e.target.value})}
                  placeholder="Last Name"
                  className="bg-background text-foreground border-input"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address_line_1" className="text-foreground">Address Line 1</Label>
              <Input
                id="address_line_1"
                value={addressForm.address_line_1}
                onChange={(e) => setAddressForm({...addressForm, address_line_1: e.target.value})}
                placeholder="Street address"
                className="bg-background text-foreground border-input"
              />
            </div>
            <div>
              <Label htmlFor="address_line_2" className="text-foreground">Address Line 2 (Optional)</Label>
              <Input
                id="address_line_2"
                value={addressForm.address_line_2}
                onChange={(e) => setAddressForm({...addressForm, address_line_2: e.target.value})}
                placeholder="Apartment, suite, etc."
                className="bg-background text-foreground border-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-foreground">City</Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                  placeholder="City"
                  className="bg-background text-foreground border-input"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-foreground">State</Label>
                <Input
                  id="state"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                  placeholder="State"
                  className="bg-background text-foreground border-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postal_code" className="text-foreground">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={addressForm.postal_code}
                  onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                  placeholder="Postal code"
                  className="bg-background text-foreground border-input"
                />
              </div>
              <div>
                <Label htmlFor="addr_phone" className="text-foreground">Phone</Label>
                <Input
                  id="addr_phone"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                  placeholder="Phone number"
                  className="bg-background text-foreground border-input"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)} className="text-foreground border-input hover:bg-muted">
                Cancel
              </Button>
              <Button onClick={saveAddress} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {editingAddress ? 'Update' : 'Add'} Address
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedUserManagement;