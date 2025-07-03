
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import Header from '../components/Header';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567'
  });

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.98,
      items: ['MURDERER Pre-Workout', 'LEAN WHEY Protein']
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Processing',
      total: 64.99,
      items: ['MUSCLE GAINER Premium']
    }
  ];

  const wishlistItems = [
    {
      id: '1',
      name: 'FAT BURNER Elite',
      price: 54.99,
      image: '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png'
    },
    {
      id: '2',
      name: 'BCAA Recovery',
      price: 34.99,
      image: '/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative h-80 bg-gradient-to-r from-red-900 via-black to-gray-900 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl font-black tracking-tight mb-4">PROFILE</h1>
            <p className="text-xl text-gray-300">Manage your account and orders</p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-gray-900 p-1 rounded-xl">
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-red-600">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-red-600">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2 data-[state=active]:bg-red-600">
                <Heart className="h-4 w-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-red-600">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <div className="bg-gray-900 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-red-400 mb-6">PERSONAL INFORMATION</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">First Name</label>
                    <Input
                      value={userInfo.firstName}
                      onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                      className="bg-black border-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Last Name</label>
                    <Input
                      value={userInfo.lastName}
                      onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                      className="bg-black border-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                    <Input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="bg-black border-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Phone</label>
                    <Input
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="bg-black border-gray-700 text-white rounded-lg"
                    />
                  </div>
                </div>
                
                <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-2">
                  UPDATE PROFILE
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-2xl font-bold text-red-400">ORDER HISTORY</h2>
              
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Order {order.id}</h3>
                      <p className="text-gray-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        order.status === 'Delivered' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-white font-bold mt-2">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-gray-300">
                    <p className="font-medium">Items:</p>
                    <p>{order.items.join(', ')}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-6">
              <h2 className="text-2xl font-bold text-red-400">WISHLIST</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-gray-900 rounded-xl p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-white font-bold mb-2">{item.name}</h3>
                    <p className="text-red-400 font-bold text-lg mb-4">${item.price.toFixed(2)}</p>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                      ADD TO CART
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <div className="bg-gray-900 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-red-400 mb-6">ACCOUNT SETTINGS</h2>
                
                <div className="space-y-6">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 justify-start">
                    Change Password
                  </Button>
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 justify-start">
                    Notification Preferences
                  </Button>
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 justify-start">
                    Privacy Settings
                  </Button>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
