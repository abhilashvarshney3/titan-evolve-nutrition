import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  XCircle, 
  RefreshCw, 
  ShoppingBag, 
  Home,
  CreditCard,
  Loader2
} from 'lucide-react';

const PaymentFailure = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orderUpdated, setOrderUpdated] = useState(false);
  
  const txnid = searchParams.get('txnid');
  const orderId = searchParams.get('orderId');
  const errorParam = searchParams.get('error') || 'Payment was unsuccessful';
  
  // Parse error details if it's JSON, otherwise use as string
  let errorDetails: any = {};
  try {
    errorDetails = JSON.parse(errorParam);
  } catch {
    errorDetails = { message: errorParam };
  }

  useEffect(() => {
    if (user && (txnid || orderId)) {
      updateFailedPayment();
    } else {
      setLoading(false);
    }
  }, [user, txnid, orderId]);

  const updateFailedPayment = async () => {
    try {
      if (txnid) {
        // Update payment record as failed
        await supabase
          .from('order_payments')
          .update({
            status: 'failed',
            gateway_response: Object.fromEntries(searchParams.entries()),
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', txnid);
      }

      if (orderId) {
        // Update order status to payment failed
        await supabase
          .from('orders')
          .update({
            status: 'payment_failed' as any,
            payment_status: 'failed' as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        setOrderUpdated(true);
        
        toast({
          title: "Payment Failed",
          description: "Your order status has been updated. Please try again or contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating failed payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
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
          <p>Updating payment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
              <p className="text-muted-foreground">
                We couldn't process your payment. Please try again.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {errorDetails.message || errorParam}
                </p>
                {errorDetails.code && (
                  <p className="text-xs text-red-600 mt-1">
                    Error Code: {errorDetails.code}
                  </p>
                )}
                {errorDetails.bankReason && errorDetails.bankReason !== 'No additional details' && (
                  <p className="text-xs text-red-600 mt-1">
                    Bank Reason: {errorDetails.bankReason}
                  </p>
                )}
                {txnid && (
                  <p className="text-xs text-red-600 mt-1">
                    Transaction ID: {txnid}
                  </p>
                )}
                {errorDetails.mihpayid && (
                  <p className="text-xs text-red-600 mt-1">
                    PayU Transaction ID: {errorDetails.mihpayid}
                  </p>
                )}
                {orderId && orderUpdated && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Order status updated
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Payment Declined</p>
                    <p className="text-sm text-muted-foreground">
                      Your payment could not be processed at this time
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">What you can do:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Check your card details and try again</li>
                    <li>• Ensure you have sufficient funds</li>
                    <li>• Try a different payment method</li>
                    <li>• Contact your bank if the issue persists</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button asChild className="flex-1">
                  <Link to="/cart">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Payment
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/shop">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;