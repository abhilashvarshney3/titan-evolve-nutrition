import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, Search, Edit, Eye, Truck } from 'lucide-react';

interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  is_guest_order?: boolean;
  guest_email?: string;
  guest_phone?: string;
  guest_first_name?: string;
  guest_last_name?: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  products?: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
  product_variants?: {
    id: string;
    variant_name: string;
    price: number;
    size: string;
    flavor?: string;
  };
}

interface OrderTracking {
  id: string;
  order_id: string;
  status: string;
  message?: string;
  tracking_number?: string;
  carrier?: string;
  estimated_delivery?: string;
  created_at: string;
}

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [orderTracking, setOrderTracking] = useState<Record<string, OrderTracking[]>>({});
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    status: '',
    message: '',
    tracking_number: '',
    carrier: '',
    estimated_delivery: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch order items for all orders with product and variant details
      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(o => o.id);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products(id, name, price, image_url),
            product_variants(id, variant_name, price, size, flavor)
          `)
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        // Group items by order_id
        const itemsByOrder: Record<string, OrderItem[]> = {};
        itemsData?.forEach(item => {
          if (!itemsByOrder[item.order_id]) {
            itemsByOrder[item.order_id] = [];
          }
          itemsByOrder[item.order_id].push(item);
        });
        setOrderItems(itemsByOrder);

        // Fetch user profiles for non-guest orders
        const userIds = ordersData.filter(o => o.user_id && !o.is_guest_order).map(o => o.user_id);
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, phone')
            .in('id', userIds);

          if (profilesError) throw profilesError;

          const profilesMap: Record<string, Profile> = {};
          profilesData?.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
          setProfiles(profilesMap);
        }

        // Fetch order tracking
        const { data: trackingData, error: trackingError } = await supabase
          .from('order_tracking')
          .select('*')
          .in('order_id', orderIds)
          .order('created_at', { ascending: false });

        if (trackingError) throw trackingError;

        // Group tracking by order_id
        const trackingByOrder: Record<string, OrderTracking[]> = {};
        trackingData?.forEach(tracking => {
          if (!trackingByOrder[tracking.order_id]) {
            trackingByOrder[tracking.order_id] = [];
          }
          trackingByOrder[tracking.order_id].push(tracking);
        });
        setOrderTracking(trackingByOrder);
      }

    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus as any, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully"
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const addOrderTracking = async () => {
    if (!selectedOrder) return;

    try {
      const { error } = await supabase
        .from('order_tracking')
        .insert([{
          order_id: selectedOrder.id,
          ...trackingForm,
          estimated_delivery: trackingForm.estimated_delivery || null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order tracking added successfully"
      });
      
      setIsTrackingDialogOpen(false);
      setTrackingForm({
        status: '',
        message: '',
        tracking_number: '',
        carrier: '',
        estimated_delivery: ''
      });
      fetchOrders();
    } catch (error) {
      console.error('Error adding order tracking:', error);
      toast({
        title: "Error",
        description: "Failed to add order tracking",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-background text-foreground border-input">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground border-input z-50">
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Placed: {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                  {order.is_guest_order ? (
                    <p className="text-sm text-blue-600">
                      Guest: {order.guest_first_name} {order.guest_last_name} ({order.guest_email})
                    </p>
                  ) : order.user_id && profiles[order.user_id] ? (
                    <p className="text-sm text-green-600">
                      User: {profiles[order.user_id].first_name} {profiles[order.user_id].last_name} ({profiles[order.user_id].email})
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2 items-center">
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {order.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsTrackingDialogOpen(true);
                      }}
                    >
                      <Truck className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Order Items:</h4>
                  {orderItems[order.id]?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.products?.name || 'Product Name Not Available'}
                        </p>
                        {item.product_variants && (
                          <p className="text-xs text-gray-600">
                            {item.product_variants.variant_name} - {item.product_variants.size}
                            {item.product_variants.flavor && ` • ${item.product_variants.flavor}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total:</span> ₹{order.total_amount}
                  </div>
                  <div>
                    <span className="font-medium">Payment:</span> {order.payment_status}
                  </div>
                  <div>
                    <span className="font-medium">Items:</span> {orderItems[order.id]?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-full mt-1 bg-background text-foreground border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background text-foreground border-input z-50">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Shipping Address:</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                      <p>{order.shipping_address.address_line_1}</p>
                      {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                      <p>{order.shipping_address.country}</p>
                      {order.shipping_address.phone && <p>Phone: {order.shipping_address.phone}</p>}
                    </div>
                  </div>
                )}

                {/* Show tracking info if available */}
                {orderTracking[order.id] && orderTracking[order.id].length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Latest Tracking Update:</div>
                    <div className="text-sm text-gray-600">
                      {orderTracking[order.id][0].message}
                      {orderTracking[order.id][0].tracking_number && (
                        <span className="ml-2">
                          Tracking: {orderTracking[order.id][0].tracking_number}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="bg-background text-foreground border-input">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Order Tracking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status" className="text-foreground">Status</Label>
              <Input
                id="status"
                value={trackingForm.status}
                onChange={(e) => setTrackingForm({...trackingForm, status: e.target.value})}
                placeholder="e.g., Shipped, Out for delivery"
                required
                className="bg-background text-foreground border-input"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-foreground">Message</Label>
              <Textarea
                id="message"
                value={trackingForm.message}
                onChange={(e) => setTrackingForm({...trackingForm, message: e.target.value})}
                placeholder="Tracking update message"
                className="bg-background text-foreground border-input"
              />
            </div>
            <div>
              <Label htmlFor="tracking_number" className="text-foreground">Tracking Number</Label>
              <Input
                id="tracking_number"
                value={trackingForm.tracking_number}
                onChange={(e) => setTrackingForm({...trackingForm, tracking_number: e.target.value})}
                placeholder="e.g., TRK123456789"
                className="bg-background text-foreground border-input"
              />
            </div>
            <div>
              <Label htmlFor="carrier" className="text-foreground">Carrier</Label>
              <Input
                id="carrier"
                value={trackingForm.carrier}
                onChange={(e) => setTrackingForm({...trackingForm, carrier: e.target.value})}
                placeholder="e.g., FedEx, Blue Dart"
                className="bg-background text-foreground border-input"
              />
            </div>
            <div>
              <Label htmlFor="estimated_delivery" className="text-foreground">Estimated Delivery</Label>
              <Input
                id="estimated_delivery"
                type="datetime-local"
                value={trackingForm.estimated_delivery}
                onChange={(e) => setTrackingForm({...trackingForm, estimated_delivery: e.target.value})}
                className="bg-background text-foreground border-input"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)} className="text-foreground border-input hover:bg-muted">
                Cancel
              </Button>
              <Button onClick={addOrderTracking} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add Tracking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;