
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Package, Settings } from 'lucide-react';
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

const Profile = () => {
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
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

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
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
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl font-black mb-4">MY PROFILE</h1>
            <p className="text-xl text-gray-300">
              Manage your account settings and preferences
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-gray-900 p-1 rounded-xl">
                <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-purple-600">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-gray-900 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Personal Information</CardTitle>
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

              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-gray-900 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-b border-purple-800/30 pb-4">
                      <h3 className="text-lg font-semibold mb-2">Password</h3>
                      <p className="text-gray-400 mb-4">Update your password to keep your account secure.</p>
                      <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                        Change Password
                      </Button>
                    </div>

                    <div className="border-b border-purple-800/30 pb-4">
                      <h3 className="text-lg font-semibold mb-2">Email Notifications</h3>
                      <p className="text-gray-400 mb-4">Manage your email notification preferences.</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-gray-300">Order updates</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-gray-300">Product announcements</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-gray-300">Marketing emails</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-red-400">Danger Zone</h3>
                      <p className="text-gray-400 mb-4">Permanently delete your account and all associated data.</p>
                      <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                        Delete Account
                      </Button>
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
