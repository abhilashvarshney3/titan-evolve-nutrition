import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock_quantity: number;
  };
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          products (
            id,
            name,
            price,
            image_url,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(itemId);
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items => items.filter(item => item.id !== itemId));
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart."
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.products.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST for India
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    // Generate order details for WhatsApp message
    const orderDetails = cartItems.map(item => 
      `${item.products.name} x ${item.quantity} = ₹${(item.products.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `Hi! I want to place an order from Titan Evolve:

*ORDER DETAILS:*
${orderDetails}

*SUMMARY:*
Subtotal: ₹${calculateSubtotal().toFixed(2)}
GST (18%): ₹${calculateTax().toFixed(2)}
*Total: ₹${calculateTotal().toFixed(2)}*

Please confirm availability and provide payment details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918800853514?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Redirected to WhatsApp",
      description: "Complete your purchase via WhatsApp chat."
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-400 mb-6">You need to be logged in to view your cart.</p>
            <Link to="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl font-black mb-4">YOUR CART</h1>
            <p className="text-xl text-gray-300">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-400 mb-6">Start shopping to add items to your cart.</p>
                <Link to="/shop">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-900 rounded-xl p-6 border border-purple-800/20"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.products.image_url || '/placeholder.svg'}
                          alt={item.products.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {item.products.name}
                          </h3>
                          <p className="text-purple-400 font-bold">
                            ₹{item.products.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updating === item.id}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center bg-black border-purple-700 text-white"
                            min="1"
                            max={item.products.stock_quantity}
                          />
                          
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updating === item.id || item.quantity >= item.products.stock_quantity}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-white">
                            ₹{(item.products.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updating === item.id}
                            onClick={() => removeItem(item.id)}
                            className="mt-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-900 rounded-xl p-6 border border-purple-800/20 h-fit">
                  <h2 className="text-2xl font-bold mb-6 text-purple-400">ORDER SUMMARY</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">GST (18%)</span>
                      <span className="text-white">₹{calculateTax().toFixed(2)}</span>
                    </div>
                    <hr className="border-purple-800/30" />
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-purple-400">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleWhatsAppCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 mb-4"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    ORDER VIA WHATSAPP
                  </Button>
                  
                  <Link to="/shop">
                    <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                      Continue Shopping
                    </Button>
                  </Link>

                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-bold text-green-400 mb-2">WHATSAPP CHECKOUT</h3>
                    <p className="text-xs text-gray-400">Click above to complete your purchase via WhatsApp. We'll guide you through the payment process.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Cart;
