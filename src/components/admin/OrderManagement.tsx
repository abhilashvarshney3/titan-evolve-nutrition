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
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
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

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [orderTracking, setOrderTracking] = useState<Record<string, OrderTracking[]>>({});
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

      // Fetch order items for all orders
      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(o => o.id);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
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
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground border-input">
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
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
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
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground border-input">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Order Tracking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={trackingForm.status}
                onChange={(e) => setTrackingForm({...trackingForm, status: e.target.value})}
                placeholder="e.g., Shipped, Out for delivery"
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={trackingForm.message}
                onChange={(e) => setTrackingForm({...trackingForm, message: e.target.value})}
                placeholder="Tracking update message"
              />
            </div>
            <div>
              <Label htmlFor="tracking_number">Tracking Number</Label>
              <Input
                id="tracking_number"
                value={trackingForm.tracking_number}
                onChange={(e) => setTrackingForm({...trackingForm, tracking_number: e.target.value})}
                placeholder="e.g., TRK123456789"
              />
            </div>
            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={trackingForm.carrier}
                onChange={(e) => setTrackingForm({...trackingForm, carrier: e.target.value})}
                placeholder="e.g., FedEx, Blue Dart"
              />
            </div>
            <div>
              <Label htmlFor="estimated_delivery">Estimated Delivery</Label>
              <Input
                id="estimated_delivery"
                type="datetime-local"
                value={trackingForm.estimated_delivery}
                onChange={(e) => setTrackingForm({...trackingForm, estimated_delivery: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addOrderTracking}>
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