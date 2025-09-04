import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  XCircle, 
  RefreshCw, 
  ShoppingBag, 
  Home,
  CreditCard
} from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Payment was unsuccessful';

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
                  <strong>Error:</strong> {errorMessage}
                </p>
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