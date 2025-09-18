import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, CreditCard, Truck } from 'lucide-react';
import CouponSection from '@/components/CouponSection';

// Data structures
interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  products: {
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

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if it's a quick buy with product data
  const quickBuyProduct = location.state?.product;
  const quickBuyVariant = location.state?.variant;

  // State management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('online');
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
    type: 'home' as const,
  });
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Fetch data on component mount
  useEffect(() => {
    const initializeCheckout = async () => {
      setLoading(true);
      try {
        if (quickBuyProduct) {
          // For quick buy, create a fake cart item
          const fakeCartItem: CartItem = {
            id: 'quick-buy',
            product_id: quickBuyProduct.id,
            variant_id: quickBuyVariant?.id,
            quantity: 1,
            products: {
              id: quickBuyProduct.id,
              name: quickBuyProduct.name,
              price: quickBuyProduct.price,
              image_url: quickBuyProduct.image_url,
            },
            product_variants: quickBuyVariant ? {
              id: quickBuyVariant.id,
              variant_name: quickBuyVariant.variant_name,
              price: quickBuyVariant.price,
              size: quickBuyVariant.size,
              flavor: quickBuyVariant.flavor,
            } : undefined,
          };
          setCartItems([fakeCartItem]);
        } else {
          await fetchCartItems();
        }
        
        if (user) {
          await fetchAddresses();
        }
      } catch (error) {
        console.error('Error initializing checkout:', error);
        toast({
          title: 'Error',
          description: 'Failed to load checkout data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [user, navigate, toast, quickBuyProduct, quickBuyVariant]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          product_id,
          variant_id,
          quantity,
          products!inner(id, name, price, image_url),
          product_variants(id, variant_name, price, size, flavor)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
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
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .insert([{ ...newAddress, user_id: user.id }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Address added successfully',
      });

      // Reset form and refresh addresses
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
        type: 'home' as const,
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: 'Error',
        description: 'Failed to add address',
        variant: 'destructive',
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.product_variants?.price || item.products.price;
      return sum + (price * item.quantity);
    }, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const finalTotal = Math.max(0, subtotal + shipping - couponDiscount);
    return { subtotal, shipping, finalTotal };
  };

  const handleCheckout = async () => {
    // Validate required fields
    if (user) {
      if (!selectedAddress) {
        toast({
          title: 'Address Required',
          description: 'Please select or add a delivery address.',
          variant: 'destructive',
        });
        return;
      }
    } else {
      // Guest checkout validation
      if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
        toast({
          title: 'Guest Details Required',
          description: 'Please fill in all required guest details.',
          variant: 'destructive',
        });
        return;
      }
      if (!newAddress.address_line_1 || !newAddress.city || !newAddress.state || !newAddress.postal_code) {
        toast({
          title: 'Address Required',
          description: 'Please fill in all required address fields.',
          variant: 'destructive',
        });
        return;
      }
    }

    if (!selectedPaymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method.',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      // Get the shipping address
      let shippingAddress;
      if (user) {
        if (selectedAddress === 'new') {
          shippingAddress = newAddress;
        } else {
          const address = addresses.find(addr => addr.id === selectedAddress);
          if (!address) {
            throw new Error('Selected address not found');
          }
          shippingAddress = {
            first_name: address.first_name,
            last_name: address.last_name,
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
            phone: address.phone,
          };
        }
      } else {
        // Guest checkout - use new address
        shippingAddress = newAddress;
      }

      // Create order (for both authenticated and guest users)
      const orderData = {
        total_amount: calculateTotal().finalTotal,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        shipping_address: shippingAddress,
        ...(user ? {
          user_id: user.id,
          is_guest_order: false,
        } : {
          user_id: null,
          is_guest_order: true,
          guest_email: guestDetails.email,
          guest_phone: guestDetails.phone,
          guest_first_name: guestDetails.firstName,
          guest_last_name: guestDetails.lastName,
        }),
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        quantity: item.quantity,
        price: item.product_variants?.price || item.products.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart for logged-in users (not for quick buy or guest)
      if (user && !quickBuyProduct) {
        await supabase.from('cart').delete().eq('user_id', user.id);
      }

      // Handle online payment (COD removed)
      const customerEmail = user ? user.email : guestDetails.email;
      const { data, error } = await supabase.functions.invoke('create-payu-payment', {
        body: {
          orderId: order.id,
          amount: calculateTotal().finalTotal,
          productInfo: `Order #${order.id}`,
          firstName: shippingAddress.first_name,
          email: customerEmail,
          phone: shippingAddress.phone,
        },
      });

      if (error) throw error;

      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Payment URL not received');
      }

    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: 'Error',
        description: 'Failed to process checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show empty cart message
  if (cartItems.length === 0 && !quickBuyProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Empty Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your cart is empty. Add some items before checkout.
            </p>
            <Button onClick={() => navigate('/shop')} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Guest Details, Delivery Address & Payment Method */}
          <div className="space-y-4 md:space-y-6">
            {/* Guest Details Section (for non-authenticated users) */}
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Guest Checkout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guest_first_name">First Name *</Label>
                      <Input
                        id="guest_first_name"
                        value={guestDetails.firstName}
                        onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest_last_name">Last Name *</Label>
                      <Input
                        id="guest_last_name"
                        value={guestDetails.lastName}
                        onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest_email">Email *</Label>
                    <Input
                      id="guest_email"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest_phone">Phone *</Label>
                    <Input
                      id="guest_phone"
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user && (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <div className="space-y-1">
                            <p className="font-medium text-sm md:text-base">
                              {address.first_name} {address.last_name}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {address.address_line_1}
                              {address.address_line_2 && `, ${address.address_line_2}`}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Phone: {address.phone}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                    
                    {/* Add New Address Option */}
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="new" id="new-address" className="mt-1" />
                      <Label htmlFor="new-address" className="flex-1 cursor-pointer">
                        <p className="font-medium text-sm md:text-base">Add New Address</p>
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {/* New Address Form */}
                {(selectedAddress === 'new' || !user) && (
                  <div className="mt-4 space-y-4 p-3 md:p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input
                          id="first_name"
                          value={newAddress.first_name}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, first_name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input
                          id="last_name"
                          value={newAddress.last_name}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, last_name: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address_line_1">Address Line 1 *</Label>
                      <Input
                        id="address_line_1"
                        value={newAddress.address_line_1}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, address_line_1: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address_line_2">Address Line 2</Label>
                      <Input
                        id="address_line_2"
                        value={newAddress.address_line_2}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, address_line_2: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postal_code">Postal Code *</Label>
                        <Input
                          id="postal_code"
                          value={newAddress.postal_code}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    {user && (
                      <Button onClick={handleAddAddress} className="w-full">
                        Save Address
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer text-sm md:text-base">
                      <CreditCard className="h-4 w-4" />
                      Online Payment
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Pay securely using UPI, Credit Card, Debit Card, or Net Banking
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Truck className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 md:space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 border rounded-lg">
                      <img
                        src={item.products.image_url || '/placeholder.svg'}
                        alt={item.products.name}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base truncate">{item.products.name}</h3>
                        {item.product_variants && (
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {item.product_variants.variant_name} - {item.product_variants.size}
                            {item.product_variants.flavor && ` • ${item.product_variants.flavor}`}
                          </p>
                        )}
                        <p className="text-xs md:text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm md:text-base">
                          ₹{((item.product_variants?.price || item.products.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Section */}
                <CouponSection 
                  onCouponApplied={setCouponDiscount}
                  cartTotal={calculateTotal().subtotal}
                />

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal().subtotal.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount:</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{calculateTotal().shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base md:text-lg">
                    <span>Total:</span>
                    <span>₹{calculateTotal().finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order • ₹{calculateTotal().finalTotal.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;