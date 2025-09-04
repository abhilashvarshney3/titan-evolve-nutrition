import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  Package, 
  CreditCard, 
  Truck,
  Home,
  ShoppingBag,
  Loader2
} from 'lucide-react';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: any;
}

const PaymentSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    if (user) {
      verifyPayment();
    }
  }, [user, searchParams]);

  const verifyPayment = async () => {
    try {
      const txnid = searchParams.get('txnid');
      const orderId = searchParams.get('orderId');
      const method = searchParams.get('method');
      const status = searchParams.get('status');
      const payuMoneyId = searchParams.get('payuMoneyId');
      
      console.log("🔍 Verifying payment:", { txnid, orderId, method, status });

      // Handle COD orders differently
      if (method === 'cod' && orderId) {
        // For COD, just fetch and display order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);
        setPaymentVerified(true);
        
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been confirmed. You can pay on delivery."
        });
        
        setLoading(false);
        return;
      }

      // Handle online payment verification
      if (!txnid) {
        throw new Error('Transaction ID not found');
      }

      // Update payment status
      const { data: paymentData, error: paymentError } = await supabase
        .from('order_payments')
        .update({
          status: status === 'success' ? 'completed' : 'failed',
          gateway_response: Object.fromEntries(searchParams.entries()),
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', txnid)
        .select('order_id')
        .single();

      if (paymentError) throw paymentError;

      if (status === 'success') {
        // Update order status
        await supabase
          .from('orders')
          .update({
            payment_status: 'completed' as any,
            status: 'confirmed' as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentData.order_id);

        // Clear cart
        await supabase
          .from('cart')
          .delete()
          .eq('user_id', user?.id);

        // Create shipment (placeholder for I Carry integration)
        await supabase.functions.invoke('create-shipment', {
          body: { orderId: paymentData.order_id }
        });

        setPaymentVerified(true);
      }

      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', paymentData.order_id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      if (status === 'success') {
        toast({
          title: "Payment Successful!",
          description: "Your order has been confirmed and is being processed."
        });
      } else {
        toast({
          title: "Payment Failed",
          description: "There was an issue with your payment. Please try again.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify payment status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verifying payment...</p>
        </div>
      </div>
    );
  }

  const isSuccess = paymentVerified && order?.payment_status === 'completed';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {isSuccess ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <Package className="h-16 w-16 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
              </CardTitle>
              <p className="text-muted-foreground">
                {isSuccess 
                  ? 'Thank you for your order. We\'re processing it now.'
                  : 'There was an issue with your payment. Please try again.'
                }
              </p>
            </CardHeader>
            
            {order && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">₹{order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={isSuccess ? "default" : "destructive"}>
                      {order.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <Badge variant={order.payment_status === 'completed' ? "default" : "destructive"}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>

                {isSuccess && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Payment Confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          Your payment has been processed successfully
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <Package className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Order Confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          We're preparing your items for shipment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <Truck className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Shipment Processing</p>
                        <p className="text-sm text-muted-foreground">
                          You'll receive tracking details via email soon
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {isSuccess ? (
                    <>
                      <Button asChild className="flex-1">
                        <Link to="/track-order">
                          <Package className="h-4 w-4 mr-2" />
                          Track Order
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="flex-1">
                        <Link to="/shop">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Continue Shopping
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => navigate('/cart')} className="flex-1">
                        Try Again
                      </Button>
                      <Button variant="outline" asChild className="flex-1">
                        <Link to="/shop">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Continue Shopping
                        </Link>
                      </Button>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <Button variant="ghost" asChild className="w-full">
                    <Link to="/">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;