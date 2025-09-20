
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package, Truck, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an order number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch order details from database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_amount,
          shipping_address,
          is_guest_order,
          guest_first_name,
          guest_last_name,
          guest_email,
          guest_phone,
          user_id,
          order_items (
            id,
            quantity,
            price,
            product:products (
              name,
              image_url
            ),
            variant:product_variants (
              variant_name
            )
          )
        `)
        .eq('id', orderNumber)
        .single();

      if (orderError) {
        toast({
          title: 'Order Not Found',
          description: 'No order found with this order number. Please check and try again.',
          variant: 'destructive',
        });
        setTrackingResult(null);
        return;
      }

      // Fetch profile data separately if it's not a guest order
      let profileData = null;
      if (!order.is_guest_order && order.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, phone')
          .eq('id', order.user_id)
          .single();
        profileData = profile;
      }

      // Fetch order tracking information
      const { data: tracking } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderNumber)
        .order('created_at', { ascending: true });

      // Fetch shipment information if available
      const { data: shipment } = await supabase
        .from('shipments')
        .select('*')
        .eq('order_id', orderNumber)
        .single();

      // Generate tracking steps based on order status and tracking data
      const generateTrackingSteps = () => {
        const steps = [
          { status: 'Order Placed', completed: true, date: new Date(order.created_at).toLocaleDateString() }
        ];

        if (tracking && tracking.length > 0) {
          tracking.forEach((track) => {
            steps.push({
              status: track.status,
              completed: true,
              date: new Date(track.created_at).toLocaleDateString()
            });
          });
        } else {
          // Default steps based on order status
          if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
            steps.push({ status: 'Processing', completed: true, date: new Date(order.created_at).toLocaleDateString() });
          }
          if (order.status === 'shipped' || order.status === 'delivered') {
            steps.push({ status: 'Shipped', completed: true, date: shipment ? new Date(shipment.created_at).toLocaleDateString() : 'TBD' });
          }
          if (order.status === 'delivered') {
            steps.push({ status: 'Delivered', completed: true, date: shipment?.actual_delivery ? new Date(shipment.actual_delivery).toLocaleDateString() : 'TBD' });
          } else if (order.status === 'shipped') {
            steps.push({ 
              status: 'In Transit', 
              completed: true, 
              date: 'In Progress' 
            });
            steps.push({ 
              status: 'Delivered', 
              completed: false, 
              date: shipment?.estimated_delivery ? `Expected: ${new Date(shipment.estimated_delivery).toLocaleDateString()}` : 'TBD' 
            });
          } else {
            steps.push({ status: 'Processing', completed: false, date: 'Pending' });
            steps.push({ status: 'Shipped', completed: false, date: 'Pending' });
            steps.push({ status: 'Delivered', completed: false, date: 'Pending' });
          }
        }

        return steps;
      };

      const customerInfo = order.is_guest_order 
        ? `${order.guest_first_name} ${order.guest_last_name}`
        : profileData 
          ? `${profileData.first_name} ${profileData.last_name}`
          : 'Unknown Customer';

      setTrackingResult({
        orderNumber: order.id,
        status: order.status,
        estimatedDelivery: shipment?.estimated_delivery 
          ? new Date(shipment.estimated_delivery).toLocaleDateString()
          : 'TBD',
        trackingNumber: shipment?.tracking_number || 'Not yet assigned',
        carrier: shipment?.carrier || 'I Carry',
        customerName: customerInfo,
        orderDate: new Date(order.created_at).toLocaleDateString(),
        totalAmount: order.total_amount,
        items: order.order_items,
        steps: generateTrackingSteps()
      });

    } catch (error) {
      console.error('Error tracking order:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch order details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary/20 to-background py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 text-foreground">TRACK ORDER</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter your order number to track your shipment
            </p>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <Card className="mb-6 md:mb-8">
              <CardContent className="pt-6">
                <form onSubmit={handleTrack} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Enter your order number"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="pl-10 h-12"
                        disabled={loading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="h-12 px-6 md:px-8 w-full md:w-auto" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Tracking...
                        </>
                      ) : (
                        'Track Order'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {trackingResult && (
              <div className="space-y-4 md:space-y-6">
                {/* Order Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl text-primary">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order Number</p>
                        <p className="font-bold text-foreground">{trackingResult.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="font-bold text-foreground">{trackingResult.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-bold text-foreground">{trackingResult.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-foreground">₹{trackingResult.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Status</p>
                        <p className="font-bold text-green-600 capitalize">{trackingResult.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="font-bold text-foreground">{trackingResult.trackingNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trackingResult.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          {item.product?.image_url && (
                            <img 
                              src={item.product.image_url} 
                              alt={item.product.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm md:text-base">
                              {item.product?.name || 'Product'}
                            </p>
                            {item.variant?.variant_name && (
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {item.variant.variant_name}
                              </p>
                            )}
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Qty: {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tracking Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Tracking Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trackingResult.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`p-2 rounded-full flex-shrink-0 ${
                            step.completed ? 'bg-green-600' : 'bg-muted'
                          }`}>
                            {step.status === 'Order Placed' && <Package className="h-4 w-4 md:h-5 md:w-5 text-white" />}
                            {step.status === 'Processing' && <Package className="h-4 w-4 md:h-5 md:w-5 text-white" />}
                            {step.status === 'Shipped' && <Truck className="h-4 w-4 md:h-5 md:w-5 text-white" />}
                            {step.status === 'In Transit' && <Truck className="h-4 w-4 md:h-5 md:w-5 text-white" />}
                            {step.status === 'Delivered' && <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-sm md:text-base ${
                              step.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {step.status}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground break-words">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {trackingResult.estimatedDelivery && trackingResult.estimatedDelivery !== 'TBD' && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 text-sm md:text-base">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p className="text-muted-foreground">
                          Estimated Delivery: <span className="font-bold text-foreground">{trackingResult.estimatedDelivery}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TrackOrder;
