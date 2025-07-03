
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Search
} from 'lucide-react';

const AdminDashboard = () => {
  const [products] = useState([
    { id: '1', name: 'MURDERER Pre-Workout', category: 'Pre-Workout', price: 49.99, stock: 150, status: 'Active' },
    { id: '2', name: 'LEAN WHEY Protein', category: 'Protein', price: 39.99, stock: 89, status: 'Active' },
    { id: '3', name: 'MUSCLE GAINER Premium', category: 'Mass Gainer', price: 64.99, stock: 45, status: 'Low Stock' }
  ]);

  const [orders] = useState([
    { id: 'ORD-001', customer: 'John Doe', total: 89.98, status: 'Processing', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', total: 149.97, status: 'Shipped', date: '2024-01-14' },
    { id: 'ORD-003', customer: 'Mike Johnson', total: 64.99, status: 'Delivered', date: '2024-01-13' }
  ]);

  const [customers] = useState([
    { id: '1', name: 'John Doe', email: 'john@email.com', orders: 5, spent: 450.00, joined: '2023-12-01' },
    { id: '2', name: 'Jane Smith', email: 'jane@email.com', orders: 3, spent: 289.97, joined: '2023-11-15' },
    { id: '3', name: 'Mike Johnson', email: 'mike@email.com', orders: 8, spent: 720.50, joined: '2023-10-20' }
  ]);

  const stats = {
    totalRevenue: 12450.00,
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: 24,
    revenueGrowth: 15.3,
    orderGrowth: 8.7,
    customerGrowth: 12.1,
    productViews: 2341
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-red-400">ADMIN DASHBOARD</h1>
          <div className="flex gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-400">+{stats.revenueGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
              <p className="text-xs text-blue-400">+{stats.orderGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalCustomers}</div>
              <p className="text-xs text-purple-400">+{stats.customerGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Products</CardTitle>
              <Package className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
              <p className="text-xs text-orange-400">{stats.productViews} total views</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-gray-900 p-1 rounded-xl">
            <TabsTrigger value="products" className="data-[state=active]:bg-red-600">Products</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-600">Orders</TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-red-600">Customers</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400">PRODUCT MANAGEMENT</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search products..." className="pl-10 bg-gray-900 border-gray-700 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-bold">Product</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Category</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Price</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Stock</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Status</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-gray-800">
                        <td className="p-4 text-white font-medium">{product.name}</td>
                        <td className="p-4 text-gray-300">{product.category}</td>
                        <td className="p-4 text-white">${product.price}</td>
                        <td className="p-4 text-white">{product.stock}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            product.status === 'Active' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-red-400">ORDER MANAGEMENT</h2>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-bold">Order ID</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Customer</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Total</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Status</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Date</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-gray-800">
                        <td className="p-4 text-white font-medium">{order.id}</td>
                        <td className="p-4 text-gray-300">{order.customer}</td>
                        <td className="p-4 text-white">${order.total}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-green-600 text-white' : 
                            order.status === 'Shipped' ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-black'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">{order.date}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <h2 className="text-2xl font-bold text-red-400">CUSTOMER MANAGEMENT</h2>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-bold">Name</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Email</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Orders</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Total Spent</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Joined</th>
                      <th className="text-left p-4 text-gray-300 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-t border-gray-800">
                        <td className="p-4 text-white font-medium">{customer.name}</td>
                        <td className="p-4 text-gray-300">{customer.email}</td>
                        <td className="p-4 text-white">{customer.orders}</td>
                        <td className="p-4 text-white">${customer.spent.toFixed(2)}</td>
                        <td className="p-4 text-gray-300">{customer.joined}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-red-400">ANALYTICS & REPORTS</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-red-400">Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-2xl font-bold text-white">$12,450</span>
                    <span className="text-green-400 text-sm">↑ 15.3%</span>
                  </div>
                  <p className="text-gray-400 mt-2">Monthly revenue growth</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-red-400">Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">MURDERER Pre-Workout</span>
                      <span className="text-white font-bold">45 sold</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">LEAN WHEY Protein</span>
                      <span className="text-white font-bold">38 sold</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">MUSCLE GAINER</span>
                      <span className="text-white font-bold">32 sold</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
