import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  CreditCard, 
  Package,
  Plus,
  Loader2,
  Truck,
  Check
} from 'lucide-react';
import CouponSection from '@/components/CouponSection';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    image_url?: string;
    price: number;
  };
  variant?: {
    id: string;
    variant_name: string;
    price: number;
    size: string;
    flavor?: string;
  };
  quantity: number;
}

interface Address {
  id: string;
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

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('online');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  const [newAddress, setNewAddress] = useState({
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

  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchAddresses();
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          product:products(id, name, price, image_url),
          variant:product_variants(id, variant_name, price, size, flavor)
        `)
        .eq('user_id', user?.id);

      if (cartError) throw cartError;
      setCartItems(cartData || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive"
      });
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
      
      // Select default address if available
      const defaultAddress = data?.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      const { error } = await supabase
        .from('addresses')
        .insert([{ ...newAddress, user_id: user?.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address added successfully"
      });
      
      setShowNewAddress(false);
      setNewAddress({
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
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price;
      return sum + (price * item.quantity);
    }, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping - couponDiscount;
    return { subtotal, shipping, total };
  };

  const handleCheckout = async () => {
    console.log("🚀 Checkout started", { 
      selectedAddress, 
      selectedPaymentMethod,
      cartItemsCount: cartItems.length 
    });
    
    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Please select a delivery address",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Error", 
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessing(true);
      console.log("💳 Starting payment process...");
      
      const selectedAddr = addresses.find(addr => addr.id === selectedAddress);
      const { subtotal, shipping, total } = calculateTotal();

      // Create order first
      const orderStatus = selectedPaymentMethod === 'cod' ? 'confirmed' : 'pending';
      const paymentStatus = selectedPaymentMethod === 'cod' ? 'pending' : 'pending';

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: total,
          status: orderStatus as any,
          payment_status: paymentStatus as any,
          shipping_address: selectedAddr as any
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        quantity: item.quantity,
        price: item.variant?.price || item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Handle payment based on method
      if (selectedPaymentMethod === 'cod') {
        // For COD, just complete the order
        console.log("📦 Processing COD order...");
        
        // Clear cart
        await supabase.from('cart').delete().eq('user_id', user?.id);
        
        // Try to create shipment, but don't fail if it errors
        try {
          await supabase.functions.invoke('create-shipment', {
            body: { orderId: orderData.id }
          });
          console.log("✅ Shipment created successfully");
        } catch (shipmentError) {
          console.warn("⚠️ Shipment creation failed, but continuing with order:", shipmentError);
          // Don't fail the entire order if shipment creation fails
        }

        toast({
          title: "Order Placed!",
          description: "Your order has been placed successfully. You can pay on delivery."
        });

        navigate(`/payment-success?orderId=${orderData.id}&method=cod`);
      } else {
        // Handle online payment, redirect to PayU
        console.log("💳 Calling PayU payment function...", {
          orderId: orderData.id,
          amount: total,
          firstName: selectedAddr?.first_name,
          email: user?.email
        });
        
        // Open PayU payment in same window
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payu-payment', {
          body: {
            orderId: orderData.id,
            amount: total,
            productInfo: `Order #${orderData.id.slice(0, 8)}`,
            firstName: selectedAddr?.first_name || 'Customer',
            email: user?.email || 'customer@example.com',
            phone: selectedAddr?.phone || '9999999999'
          }
        });

        console.log("💳 PayU response:", { paymentData, paymentError });

        if (paymentError) throw paymentError;

        // The PayU function returns HTML form, open in new window/redirect
        if (paymentData) {
          console.log("🔄 Opening PayU payment page...");
          
          // Clear cart before payment
          await supabase.from('cart').delete().eq('user_id', user?.id);
          
          // Open PayU form in new window
          const paymentWindow = window.open('', '_blank', 'width=800,height=600');
          if (paymentWindow) {
            paymentWindow.document.write(paymentData);
            paymentWindow.document.close();
          } else {
            // Fallback: create blob URL if popup blocked
            const blob = new Blob([paymentData], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.location.href = url;
          }
        } else {
          console.error("❌ No payment data received:", paymentData);
          throw new Error("No payment data received from payment gateway");
        }
      }

    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Error",
        description: "Failed to process checkout",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { subtotal, shipping, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Review your order and complete payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 && (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={address.id} className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {address.first_name} {address.last_name}
                              </span>
                              {address.is_default && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {address.address_line_1}
                              {address.address_line_2 && `, ${address.address_line_2}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.postal_code}
                            </p>
                            {address.phone && (
                              <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                            )}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                <Button
                  variant="outline"
                  onClick={() => setShowNewAddress(!showNewAddress)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>

                {showNewAddress && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={newAddress.first_name}
                          onChange={(e) => setNewAddress({...newAddress, first_name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={newAddress.last_name}
                          onChange={(e) => setNewAddress({...newAddress, last_name: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address_line_1">Address Line 1</Label>
                      <Input
                        id="address_line_1"
                        value={newAddress.address_line_1}
                        onChange={(e) => setNewAddress({...newAddress, address_line_1: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                      <Input
                        id="address_line_2"
                        value={newAddress.address_line_2}
                        onChange={(e) => setNewAddress({...newAddress, address_line_2: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Input
                          id="postal_code"
                          value={newAddress.postal_code}
                          onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddAddress} className="w-full">
                      Save Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <div className="flex items-start space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="online" id="online" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="online" className="cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">Online Payment</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Credit Card, Debit Card, UPI, Net Banking & More
                        </p>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="cod" className="cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="h-4 w-4" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Pay when your order is delivered
                        </p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
                  const price = item.variant?.price || item.product.price;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">
                            {item.variant.variant_name} - {item.variant.size}
                            {item.variant.flavor && `, ${item.variant.flavor}`}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="font-medium">₹{(price * item.quantity).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Separator />

                <CouponSection 
                  onCouponApplied={(discount) => setCouponDiscount(discount)}
                  cartTotal={subtotal}
                />

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toFixed(0)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="w-full" 
                  size="lg"
                  disabled={processing || !selectedAddress || !selectedPaymentMethod}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : selectedPaymentMethod === 'cod' ? (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Place Order (COD)
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay ₹{total.toFixed(0)}
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders above ₹500</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;