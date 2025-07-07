import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Package, Settings, Heart, Plus, Edit, Trash2, Home, Building2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Address {
  id: string;
  type: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
  };
}

// Updated product images mapping
const productImageMap: { [key: string]: string } = {
  'whey-protein': '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png',
  'lean-whey-1': '/lovable-uploads/6f21609e-a5cd-4cc0-a41a-82da539f5d0f.png',
  'lean-whey-2': '/lovable-uploads/cc7b982a-2963-4aa1-a018-5a61326ddf2c.png',
  'lean-whey-3': '/lovable-uploads/4fee9b66-0c62-4d8c-b54d-72d7f96438ee.png',
  'lean-whey-4': '/lovable-uploads/eb51c9b0-6315-4286-917c-7cb77f40819b.png',
  'lean-whey-5': '/lovable-uploads/01639641-f34b-4a7f-b28d-02d91875dc2c.png',
  'lean-whey-6': '/lovable-uploads/81d96adc-b283-4208-990d-1f54b9bda60f.png',
  'lean-whey-7': '/lovable-uploads/1e473ded-53cc-4557-ac29-e3a9e518d662.png',
  'murderer-pre-1': '/lovable-uploads/ff150af1-45f4-466a-a0f0-8c24b6de0207.png',
  'murderer-pre-2': '/lovable-uploads/3e9a2628-505c-4ff1-87e4-bf4481e661c9.png'
};

const Profile = () => {
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
    is_default: false
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAddresses();
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        setProfile({
          first_name: '',
          last_name: '',
          email: user.email || '',
          phone: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url,
            description
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update wishlist items with new images and pricing
      const updatedWishlist = (data || []).map((item, index) => {
        const imageKeys = Object.keys(productImageMap);
        const imageKey = imageKeys[index % imageKeys.length];
        return {
          ...item,
          products: {
            ...item.products,
            image_url: productImageMap[imageKey] || item.products.image_url,
            price: Math.max(item.products.price, 4500 + (index * 500))
          }
        };
      });

      setWishlistItems(updatedWishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const addressData = {
        ...newAddress,
        user_id: user.id
      };

      if (editingAddress) {
        const { error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingAddress.id);

        if (error) throw error;
        toast({ title: "Address Updated", description: "Your address has been updated successfully." });
      } else {
        const { error } = await supabase
          .from('addresses')
          .insert([addressData]);

        if (error) throw error;
        toast({ title: "Address Added", description: "Your address has been added successfully." });
      }

      setShowAddressForm(false);
      setEditingAddress(null);
      setNewAddress({
        type: 'home',
        first_name: '',
        last_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        phone: '',
        is_default: false
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      toast({ title: "Address Deleted", description: "Address has been deleted successfully." });
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address.",
        variant: "destructive"
      });
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistId);

      if (error) throw error;

      toast({ title: "Removed from Wishlist", description: "Item has been removed from your wishlist." });
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from wishlist.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <User className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-400 mb-6">You need to be logged in to view your profile.</p>
            <Link to="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-900 to-black py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-black mb-4">MY PROFILE</h1>
            <p className="text-lg md:text-xl text-gray-300">
              Manage your account settings and preferences
            </p>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-gray-900 p-1 rounded-xl grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 text-xs md:text-sm">
                  <User className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="addresses" className="data-[state=active]:bg-purple-600 text-xs md:text-sm">
                  <MapPin className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Addresses</span>
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="data-[state=active]:bg-purple-600 text-xs md:text-sm">
                  <Heart className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Wishlist</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-purple-600 text-xs md:text-sm">
                  <Package className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Orders</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-gray-900 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={updateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name
                          </label>
                          <Input
                            type="text"
                            value={profile.first_name}
                            onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                            className="bg-black border-purple-700 text-white"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name
                          </label>
                          <Input
                            type="text"
                            value={profile.last_name}
                            onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                            className="bg-black border-purple-700 text-white"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Mail className="h-4 w-4 inline mr-2" />
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="bg-black border-purple-700 text-white"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Phone className="h-4 w-4 inline mr-2" />
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="bg-black border-purple-700 text-white"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={updating}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                      >
                        {updating ? 'UPDATING...' : 'UPDATE PROFILE'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-purple-400">My Addresses</h2>
                  <Button
                    onClick={() => setShowAddressForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <Card className="bg-gray-900 border-purple-800/30">
                    <CardHeader>
                      <CardTitle className="text-purple-400">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={saveAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Address Type
                            </label>
                            <select
                              value={newAddress.type}
                              onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                              className="w-full bg-black border border-purple-700 rounded-md px-3 py-2 text-white"
                            >
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="flex items-center space-x-2 pt-6">
                            <input
                              type="checkbox"
                              id="is_default"
                              checked={newAddress.is_default}
                              onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                              className="rounded"
                            />
                            <label htmlFor="is_default" className="text-sm text-gray-300">
                              Set as default address
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="First Name"
                            value={newAddress.first_name}
                            onChange={(e) => setNewAddress({...newAddress, first_name: e.target.value})}
                            className="bg-black border-purple-700 text-white"
                            required
                          />
                          <Input
                            placeholder="Last Name"
                            value={newAddress.last_name}
                            onChange={(e) => setNewAddress({...newAddress, last_name: e.target.value})}
                            className="bg-black border-purple-700 text-white"
                            required
                          />
                        </div>

                        <Input
                          placeholder="Address Line 1"
                          value={newAddress.address_line_1}
                          onChange={(e) => setNewAddress({...newAddress, address_line_1: e.target.value})}
                          className="bg-black border-purple-700 text-white"
                          required
                        />

                        <Input
                          placeholder="Address Line 2 (Optional)"
                          value={newAddress.address_line_2}
                          onChange={(e) => setNewAddress({...newAddress, address_line_2: e.target.value})}
                          className="bg-black border-purple-700 text-white"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            className="bg-black border-purple-700 text-white"
                            required
                          />
                          <Input
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                            className="bg-black border-purple-700 text-white"
                            required
                          />
                          <Input
                            placeholder="Postal Code"
                            value={newAddress.postal_code}
                            onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                            className="bg-black border-purple-700 text-white"
                            required
                          />
                        </div>

                        <Input
                          placeholder="Phone Number (Optional)"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          className="bg-black border-purple-700 text-white"
                        />

                        <div className="flex gap-4">
                          <Button
                            type="submit"
                            disabled={updating}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {updating ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddressForm(false);
                              setEditingAddress(null);
                            }}
                            className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Address List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <Card key={address.id} className="bg-gray-900 border-purple-800/30 relative">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-2">
                            {address.type === 'home' ? (
                              <Home className="h-5 w-5 text-purple-400" />
                            ) : (
                              <Building2 className="h-5 w-5 text-purple-400" />
                            )}
                            <span className="font-bold text-purple-400 uppercase">
                              {address.type}
                            </span>
                            {address.is_default && (
                              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingAddress(address);
                                setNewAddress(address);
                                setShowAddressForm(true);
                              }}
                              className="text-purple-400 hover:bg-purple-600/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteAddress(address.id)}
                              className="text-red-400 hover:bg-red-600/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-gray-300 space-y-1">
                          <p className="font-semibold text-white">
                            {address.first_name} {address.last_name}
                          </p>
                          <p>{address.address_line_1}</p>
                          {address.address_line_2 && <p>{address.address_line_2}</p>}
                          <p>{address.city}, {address.state} {address.postal_code}</p>
                          <p>{address.country}</p>
                          {address.phone && <p>Phone: {address.phone}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {addresses.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Addresses</h3>
                    <p className="text-gray-400 mb-4">Add your first address to get started.</p>
                    <Button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Add Address
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-400 flex items-center">
                  <Heart className="h-6 w-6 mr-2" />
                  My Wishlist ({wishlistItems.length})
                </h2>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-400 mb-4">Add some products to your wishlist!</p>
                    <Link to="/shop">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <Card key={item.id} className="bg-gray-900 border-purple-800/30 overflow-hidden hover:scale-105 transition-transform">
                        <div className="relative">
                          <Link to={`/product/${item.product_id}`}>
                            <img
                              src={item.products.image_url || '/placeholder.svg'}
                              alt={item.products.name}
                              className="w-full h-48 object-cover"
                            />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 bg-black/50 text-red-400 hover:bg-red-600/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <Link to={`/product/${item.product_id}`}>
                            <h3 className="font-bold text-white hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                              {item.products.name}
                            </h3>
                          </Link>
                          <p className="text-purple-400 font-bold text-xl mb-3">
                            ₹{item.products.price.toFixed(0)}
                          </p>
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {item.products.description}
                          </p>
                          <Link to={`/product/${item.product_id}`}>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                              View Product
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card className="bg-gray-900 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
                      <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
                      <Link to="/shop">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Profile;
